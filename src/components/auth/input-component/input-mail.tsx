import { Control, FieldValues, Path } from 'react-hook-form';
import { Input } from "@/src/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/src/components/ui/form';

type CustomFormMailProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    labelText?: string;
};

export function CustomFormMail<T extends FieldValues>({ name, control, labelText }: CustomFormMailProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="capitalize">{labelText || name}</FormLabel>
                    <FormControl>
                        <div className="space-y-2">
                            <div className="flex rounded-lg shadow-sm shadow-black/5">
                                <Input
                                    {...field}
                                    id={name}
                                    className="-me-px rounded-e-none shadow-none focus-visible:z-10"
                                    placeholder="ex: google"
                                    type="text"
                                    value={field.value}  // Met à jour seulement la partie avant le "@"
                                    onChange={e => field.onChange(e.target.value)}  // Ajoute ou met à jour la partie avant et après '@'
                                />
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
