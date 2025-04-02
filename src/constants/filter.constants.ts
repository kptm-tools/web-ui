import { i18n } from 'src/boot/i18n';

const { t } = i18n.global;

export const SEVERITY_OPTIONS = [
  {
    value: 'Low',
    label: t('filters.severity.low')
  },
  {
    value: 'Medium',
    label: t('filters.severity.medium')
  },
  {
    value: 'High',
    label: t('filters.severity.high')
  },
  {
    value: 'Critical',
    label: t('filters.severity.critical')
  }
];

export const TIME_PERIOD_OPTIONS = [
  {
    value: 'Month',
    label: t('filters.time_period.month')
  },
  {
    value: 'Quarter',
    label: t('filters.time_period.quarter')
  },
  {
    value: 'Semester',
    label: t('filters.time_period.semester')
  }
];
