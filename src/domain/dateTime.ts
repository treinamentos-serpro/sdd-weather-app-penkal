const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  timeZone: 'UTC',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  timeZone: 'UTC',
});

function civilDateToUtc(date: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (!match) {
    throw new RangeError('Data inválida.');
  }

  const [, year, month, day] = match;
  const civilDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    civilDate.getUTCFullYear() !== Number(year) ||
    civilDate.getUTCMonth() !== Number(month) - 1 ||
    civilDate.getUTCDate() !== Number(day)
  ) {
    throw new RangeError('Data inválida.');
  }

  return civilDate;
}

function localDateTimeToUtc(dateTime: string): Date {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})$/.exec(dateTime);

  if (!match) {
    throw new RangeError('Data e hora inválidas.');
  }

  const [, date, hour, minute] = match;
  const civilDate = civilDateToUtc(date);
  const localDateTime = new Date(
    Date.UTC(
      civilDate.getUTCFullYear(),
      civilDate.getUTCMonth(),
      civilDate.getUTCDate(),
      Number(hour),
      Number(minute),
    ),
  );

  if (Number(hour) > 23 || Number(minute) > 59) {
    throw new RangeError('Data e hora inválidas.');
  }

  return localDateTime;
}

export function formatForecastDate(date: string): string {
  return dateFormatter.format(civilDateToUtc(date));
}

export function formatUpdatedAt(observedAt: string): string {
  return `Atualizado às ${timeFormatter.format(localDateTimeToUtc(observedAt))}`;
}
