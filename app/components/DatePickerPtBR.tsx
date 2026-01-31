'use client';

import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import { format, parse } from 'date-fns';

// Registrar locale pt-BR
registerLocale('pt-BR', ptBR);

interface DatePickerPtBRProps {
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
}

/**
 * DatePicker customizado em português brasileiro
 * Usa parse/format do date-fns para evitar bugs de timezone
 */
export default function DatePickerPtBR({
    value,
    onChange,
    placeholder = 'DD/MM/AAAA',
}: DatePickerPtBRProps) {
    // Converter string YYYY-MM-DD para Date sem bug de timezone
    const parseDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;
        try {
            // Parse a data como local (sem timezone)
            return parse(dateStr, 'yyyy-MM-dd', new Date());
        } catch {
            return null;
        }
    };

    // Converter Date para string YYYY-MM-DD sem bug de timezone
    const formatToISO = (date: Date): string => {
        return format(date, 'yyyy-MM-dd');
    };

    // Formatar data para exibição (DD/MM/AAAA)
    const formatDisplay = (date: Date): string => {
        return format(date, 'dd/MM/yyyy');
    };

    const selectedDate = parseDate(value);

    // Handler para mudança de data
    const handleChange = (date: Date | null) => {
        if (date) {
            onChange(formatToISO(date));
        } else {
            onChange('');
        }
    };

    // Custom input com estilo do projeto
    const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
        ({ onClick }, ref) => (
            <button
                type="button"
                onClick={onClick}
                ref={ref}
                className="w-full px-4 py-3 bg-transparent border-2 border-[#0056E2]/50 rounded-xl text-white text-left focus:border-[#00CAFC] focus:outline-none transition"
            >
                {selectedDate ? (
                    <span>{formatDisplay(selectedDate)}</span>
                ) : (
                    <span className="text-[#404A5C]">{placeholder}</span>
                )}
            </button>
        )
    );
    CustomInput.displayName = 'CustomInput';

    return (
        <DatePicker
            selected={selectedDate}
            onChange={handleChange}
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
            customInput={<CustomInput />}
            maxDate={new Date()}
            showPopperArrow={false}
            popperPlacement="bottom-start"
        />
    );
}
