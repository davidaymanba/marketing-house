import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Base = { label: string; error?: string; id: string };

const shell =
  "peer w-full rounded-2xl border border-line bg-surface/50 px-5 pb-3 pt-7 text-fg outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-transparent focus:border-primary-light focus:bg-surface/80 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.18)] aria-[invalid=true]:border-red-400/70";
const floating =
  "pointer-events-none absolute start-5 top-5 origin-[left_top] text-muted transition-[translate,scale,color] duration-300 ease-expo rtl:origin-[right_top] peer-focus:-translate-y-3 peer-focus:scale-[0.8] peer-focus:text-glow peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[0.8]";

function FieldWrap({ children, error, id }: { children: ReactNode; error?: string; id: string }) {
  return (
    <div className="relative">
      {children}
      {/* Animated focus line */}
      <span aria-hidden className="bg-signature pointer-events-none absolute inset-x-5 bottom-0 h-px origin-center scale-x-0 transition-transform duration-500 ease-expo peer-focus:scale-x-100" />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 ps-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const TextField = forwardRef<HTMLInputElement, Base & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, id, className, ...props }, ref) => (
    <FieldWrap error={error} id={id}>
      <input
        ref={ref}
        id={id}
        placeholder=" "
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(shell, "h-16", className)}
        {...props}
      />
      <label htmlFor={id} className={floating}>
        {label}
      </label>
    </FieldWrap>
  ),
);
TextField.displayName = "TextField";

export const TextAreaField = forwardRef<HTMLTextAreaElement, Base & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, id, className, ...props }, ref) => (
    <FieldWrap error={error} id={id}>
      <textarea
        ref={ref}
        id={id}
        placeholder=" "
        rows={5}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(shell, "resize-none", className)}
        data-lenis-prevent
        {...props}
      />
      <label htmlFor={id} className={floating}>
        {label}
      </label>
    </FieldWrap>
  ),
);
TextAreaField.displayName = "TextAreaField";

export const SelectField = forwardRef<
  HTMLSelectElement,
  Base & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder: string }
>(({ label, error, id, options, placeholder, className, ...props }, ref) => (
  <FieldWrap error={error} id={id}>
    <select
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      className={cn(shell, "h-16 appearance-none bg-[length:16px] bg-no-repeat pe-12 rtl:[--select-arrow:1.25rem]", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C084FC' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "var(--select-arrow, calc(100% - 1.25rem)) center",
      }}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-bg-elevated">
          {o.label}
        </option>
      ))}
    </select>
    <label htmlFor={id} className="pointer-events-none absolute start-5 top-2.5 text-xs text-muted">
      {label}
    </label>
  </FieldWrap>
));
SelectField.displayName = "SelectField";
