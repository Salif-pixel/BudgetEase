import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/src/components/ui/form";
import { ReactNode } from "react";

type CustomFormInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    placeholder?: string;
    icon?: ReactNode;
};

export function CustomFormInput<T extends FieldValues>({
                                                           name,
                                                           control,
                                                           label,
                                                           placeholder,
                                                           icon,
                                                       }: CustomFormInputProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {/* Affiche le label si fourni */}
                    {label && <FormLabel className="capitalize">{label}</FormLabel>}
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex rounded-lg relative shadow-sm shadow-black/5">
                                {/* Icône optionnelle */}
                                {icon && (
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {icon}
                                    </div>
                                )}
                                <Input
                                    {...field}
                                    id={name}
                                    className={`${icon ? "pl-10" : ""} rounded-lg shadow-none focus-visible:z-10`} // Ajoute un padding si une icône est présente
                                    placeholder={placeholder}
                                    type="text"
                                    value={field.value || ""} // Assure que la valeur n'est jamais undefined
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
                            </div>
                        </div>
                    </FormControl>
                    {/* Affiche les messages d'erreur de validation */}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}