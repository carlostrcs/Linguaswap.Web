// src/features/progress/HistoryRangeSelector.tsx

export type HistoryRangeDays = 7 | 30 | 90 | 365;

type HistoryRangeSelectorProps = {
  value: HistoryRangeDays;
  disabled?: boolean;
  onChange: (value: HistoryRangeDays) => void;
};

const OPTIONS: HistoryRangeDays[] = [7, 30, 90, 365];

export function HistoryRangeSelector({
  value,
  disabled = false,
  onChange,
}: HistoryRangeSelectorProps) {
  return (
    <div className="formField">
      <label>Rango</label>
      <select
        className="input"
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(Number(event.target.value) as HistoryRangeDays)
        }
      >
        {OPTIONS.map((option) => (
          <option key={option} value={option}>
            Últimos {option} días
          </option>
        ))}
      </select>
    </div>
  );
}