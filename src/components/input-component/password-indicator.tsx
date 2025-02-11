import { Control, FieldValues, Path, useWatch } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/src/components/ui/form";
import { useState, useMemo } from "react";

type CustomFormPasswordProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
};

export function CustomFormPassword<T extends FieldValues>({ name, control, labelText }: CustomFormPasswordProps<T>) {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const password = useWatch({ control, name }) || "";

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const checkStrength = (pass: string) => {
        const requirements = [
            { regex: /.{8,}/, text: "minimum 8 caractères" },
            { regex: /[0-9]/, text: "1 chiffre au moins " },
            { regex: /[a-z]/, text: "une lettre minuscule au moins" },
            { regex: /[A-Z]/, text: "une lettre majuscule au moins" },
        ];
        return requirements.map((req) => ({ met: req.regex.test(pass), text: req.text }));
    };

    const strength = checkStrength(password);
    const strengthScore = useMemo(() => strength.filter((req) => req.met).length, [strength]);

    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return "Entrez un mot de passe";
        if (score <= 2) return "Mot de passe faible";
        if (score === 3) return "Mot de passe moyen";
        return "Mot de passe fort";
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="capitalize">{labelText || name}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                {...field}
                                id={name}
                                className="pe-9"
                                placeholder="Password"
                                type={isVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => field.onChange(e.target.value)}
                                aria-invalid={strengthScore < 4}
                                aria-describedby={`${name}-description`}
                            />
                            <button
                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center"
                                type="button"
                                onClick={toggleVisibility}
                                aria-label={isVisible ? "Hide password" : "Show password"}
                            >
                                {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </FormControl>

                    {/* Password strength indicator */}
                    <div className="mb-4 mt-3 h-1 w-full rounded-full bg-border">
                        <div
                            className={`h-full ${getStrengthColor(strengthScore)}`}
                            style={{ width: `${(strengthScore / 4) * 100}%` }}
                        ></div>
                    </div>

                    {/* Password requirements */}
                    <p id={`${name}-description`} className="mb-2 text-sm font-medium">
                        {getStrengthText(strengthScore)}. Il doit contenir :
                    </p>

                    <ul className="space-y-1.5">
                        {strength.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? <Check size={16} className="text-emerald-500" /> : <X size={16} />}
                                <span className={req.met ? "text-emerald-600" : "text-muted-foreground"}>
                                    {req.text}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
