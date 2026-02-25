/* ═══════════════════════════════════════════════════════════
   src/shared/components/atoms/index.tsx — venService v2.0
   Primitive UI atoms — smallest reusable building blocks.
   Each atom is fully typed, accessible, and composable.
   ═══════════════════════════════════════════════════════════ */

import React from 'react';
import { cx } from '../../../lib';

// ── Badge ──────────────────────────────────────────────────

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
    default: 'badge--default',
    success: 'badge--success',
    warning: 'badge--warning',
    danger: 'badge--danger',
    info: 'badge--info',
    brand: 'badge--brand',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span className={cx('badge', badgeStyles[variant], className)}>
            {children}
        </span>
    );
}

// ── Button ─────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    className,
    ...rest
}: ButtonProps) {
    return (
        <button
            className={cx('btn', `btn--${variant}`, `btn--${size}`, className)}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...rest}
        >
            {isLoading && <span className="btn__spinner" aria-hidden />}
            {!isLoading && leftIcon && <span className="btn__icon btn__icon--left">{leftIcon}</span>}
            <span>{children}</span>
            {!isLoading && rightIcon && <span className="btn__icon btn__icon--right">{rightIcon}</span>}
        </button>
    );
}

// ── Input ──────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftAddon?: React.ReactNode;
    rightAddon?: React.ReactNode;
}

export function Input({
    label,
    error,
    hint,
    leftAddon,
    rightAddon,
    id,
    className,
    ...rest
}: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className={cx('field', error && 'field--error', className)}>
            {label && (
                <label htmlFor={inputId} className="field__label">
                    {label}
                </label>
            )}
            <div className="field__wrapper">
                {leftAddon && <span className="field__addon field__addon--left">{leftAddon}</span>}
                <input
                    id={inputId}
                    className="field__input"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    {...rest}
                />
                {rightAddon && <span className="field__addon field__addon--right">{rightAddon}</span>}
            </div>
            {error && <p id={`${inputId}-error`} className="field__error" role="alert">{error}</p>}
            {!error && hint && <p id={`${inputId}-hint`} className="field__hint">{hint}</p>}
        </div>
    );
}

// ── Divider ────────────────────────────────────────────────

interface DividerProps {
    label?: string;
    className?: string;
}

export function Divider({ label, className }: DividerProps) {
    return (
        <div className={cx('divider', className)} role="separator">
            {label && <span className="divider__label">{label}</span>}
        </div>
    );
}

// ── Avatar ─────────────────────────────────────────────────

interface AvatarProps {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
    const initials = name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className={cx('avatar', `avatar--${size}`, className)} aria-label={name}>
            {src
                ? <img src={src} alt={name} className="avatar__img" />
                : <span className="avatar__initials">{initials}</span>
            }
        </div>
    );
}

// ── Skeleton ───────────────────────────────────────────────

interface SkeletonProps {
    width?: string;
    height?: string;
    rounded?: boolean;
    className?: string;
}

export function Skeleton({ width, height, rounded, className }: SkeletonProps) {
    return (
        <div
            className={cx('skeleton', rounded && 'skeleton--rounded', className)}
            style={{ width, height }}
            aria-hidden="true"
        />
    );
}

// ── Icon wrapper ───────────────────────────────────────────

interface IconProps {
    children: React.ReactNode;
    size?: number;
    className?: string;
    label?: string;
}

export function Icon({ children, size = 20, className, label }: IconProps) {
    return (
        <span
            className={cx('icon', className)}
            style={{ width: size, height: size }}
            aria-label={label}
            aria-hidden={!label}
        >
            {children}
        </span>
    );
}
