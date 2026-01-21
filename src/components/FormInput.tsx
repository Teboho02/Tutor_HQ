import React, { useState, useEffect, type InputHTMLAttributes } from 'react';
import { z } from 'zod';
import './FormInput.css';

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    schema?: z.ZodSchema;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
    required?: boolean;
    helpText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    value,
    onChange,
    error: externalError,
    schema,
    validateOnBlur = true,
    validateOnChange = false,
    required = false,
    helpText,
    className = '',
    ...props
}) => {
    const [internalError, setInternalError] = useState<string>('');
    const [touched, setTouched] = useState(false);

    const error = externalError || internalError;

    const validate = (val: string) => {
        if (!schema) return true;

        try {
            schema.parse(val);
            setInternalError('');
            return true;
        } catch (err: unknown) {
            if (err instanceof z.ZodError) {
                setInternalError(err.issues[0]?.message || 'Invalid input');
            }
            return false;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        if (validateOnChange && touched) {
            validate(newValue);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (validateOnBlur) {
            validate(value);
        }
    };

    useEffect(() => {
        if (externalError) {
            setInternalError('');
        }
    }, [externalError]);

    return (
        <div className={`form-input-wrapper ${className}`}>
            <label htmlFor={name} className="form-label">
                {label}
                {required && <span className="required-asterisk">*</span>}
            </label>
            <input
                id={name}
                name={name}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${error ? 'form-input-error' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : helpText ? `${name}-help` : undefined}
                {...props}
            />
            {helpText && !error && (
                <p id={`${name}-help`} className="form-help-text">
                    {helpText}
                </p>
            )}
            {error && (
                <p id={`${name}-error`} className="form-error-text" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;
