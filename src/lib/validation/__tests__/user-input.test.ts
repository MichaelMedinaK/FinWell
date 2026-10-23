import { describe, expect, it } from 'vitest';
import { fullYearsBetween } from '@/domain/dates';
import { parseLoginInput, parseProfileInput, parseRegistrationInput } from '../user-input';

const REFERENCE_DAY = new Date('2026-10-23T00:00:00.000Z');

describe('parseRegistrationInput', () => {
  const validValues = {
    email: '  Ana.Perez@Gmail.com ',
    name: ' Ana Pérez ',
    password: 'clave-segura',
    birthDate: '1990-05-14',
  };

  it('returns normalized data for valid input', () => {
    expect(parseRegistrationInput(validValues, REFERENCE_DAY)).toEqual({
      success: true,
      data: {
        email: 'ana.perez@gmail.com',
        name: 'Ana Pérez',
        password: 'clave-segura',
        birthDate: new Date('1990-05-14T00:00:00.000Z'),
      },
    });
  });

  it('reports every invalid field', () => {
    const result = parseRegistrationInput({ email: 'no-es-correo', name: '', password: 'corta', birthDate: '' }, REFERENCE_DAY);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).sort()).toEqual(['birthDate', 'email', 'name', 'password']);
    }
  });

  it('rejects future birth dates and users under the minimum age', () => {
    const future = parseRegistrationInput({ ...validValues, birthDate: '2027-01-01' }, REFERENCE_DAY);
    const tooYoung = parseRegistrationInput({ ...validValues, birthDate: '2014-01-01' }, REFERENCE_DAY);
    expect(future.success === false && future.errors.birthDate).toBe('La fecha no puede ser futura.');
    expect(tooYoung.success === false && tooYoung.errors.birthDate).toMatch(/al menos/);
  });

  it('rejects passwords longer than bcrypt supports', () => {
    const result = parseRegistrationInput({ ...validValues, password: 'x'.repeat(73) }, REFERENCE_DAY);
    expect(result.success === false && result.errors.password).toMatch(/Máximo/);
  });
});

describe('parseLoginInput', () => {
  it('normalizes the email and keeps the password untouched', () => {
    expect(parseLoginInput({ email: ' USER@Mail.com', password: ' abc ' })).toEqual({
      success: true,
      data: { email: 'user@mail.com', password: ' abc ' },
    });
  });

  it('requires email and password', () => {
    const result = parseLoginInput({});
    expect(result.success === false && Object.keys(result.errors).sort()).toEqual(['email', 'password']);
  });
});

describe('parseProfileInput', () => {
  it('accepts a valid birth date', () => {
    expect(parseProfileInput({ birthDate: '2000-02-29' }, REFERENCE_DAY)).toEqual({
      success: true,
      data: { birthDate: new Date('2000-02-29T00:00:00.000Z') },
    });
  });

  it('rejects an impossible date', () => {
    expect(parseProfileInput({ birthDate: '2001-02-29' }, REFERENCE_DAY).success).toBe(false);
  });
});

describe('fullYearsBetween', () => {
  it('counts a year only after the anniversary', () => {
    expect(fullYearsBetween(new Date('2000-10-24T00:00:00Z'), REFERENCE_DAY)).toBe(25);
    expect(fullYearsBetween(new Date('2000-10-23T00:00:00Z'), REFERENCE_DAY)).toBe(26);
  });
});
