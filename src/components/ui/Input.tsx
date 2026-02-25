/* ─────────────────────────────────────────────────────────────
   Input.tsx — venService v2.0
   Production-grade input: label, error state, icon slots,
   forwardRef, full accessibility, design-token styling.
   ───────────────────────────────────────────────────────────── */

import React, { forwardRef, useId } from 'react';

// ── Types ──────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

// ── Component ──────────────────────────────────────────────────

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    {
        label,
        error,
        hint,
        leftIcon,
        rightIcon,
        fullWidth = false,
        className = '',
        id: externalId,
        disabled,
        ...rest
    },
    ref
) {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    const describedBy = [
        error ? errorId : '',
        hint ? hintId : '',
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div
            className="input-field"
            style={{ width: fullWidth ? '100%' : undefined }}
        >
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                </label>
            )}

            <div className={`input-wrapper${error ? ' input-wrapper--error' : ''}${disabled ? ' input-wrapper--disabled' : ''}`}>
                {leftIcon && (
                    <span className="input-icon input-icon--left" aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={id}
                    className={`input-control${leftIcon ? ' has-left-icon' : ''}${rightIcon ? ' has-right-icon' : ''} ${className}`}
                    disabled={disabled}
                    aria-invalid={!!error}
                    aria-describedby={describedBy}
                    {...rest}
                />

                {rightIcon && (
                    <span className="input-icon input-icon--right" aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </div>

            {error && (
                <span id={errorId} className="input-error" role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className="input-hint">
                    {hint}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';
export default Input;
