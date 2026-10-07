import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import type { Category } from '@/shared/constants/domain';
import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

import { OnboardingHeader } from '../../onboarding/components/OnboardingHeader';
import { myInfoNavigateOptions } from '../../profile/myInfoToast';
import { readBaseLocationLabel } from '../baseLocationLabel';
import { BaseLocationCard } from '../components/BaseLocationCard';
import { CategoryPicker } from '../components/CategoryPicker';
import { RadiusPicker } from '../components/RadiusPicker';
import { useMyPreferences, useUpdatePreferences } from '../hooks';
import { preferencesFormSchema, type PreferencesForm } from '../schema';

// 온보딩 3/4 좋아하는 가게·거리 (피그마 R4-2), 내 정보 > 좋아하는 가게·거리 (/me/preferences)
export function PreferencesPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const preferences = useMyPreferences();
  const updatePreferences = useUpdatePreferences();
  const { control, setValue, handleSubmit, formState } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesFormSchema),
    mode: 'onChange',
    values: preferences.data && {
      categories: preferences.data.categories,
      radiusM: preferences.data.radiusM,
    },
  });

  const isEditMode = pathname.startsWith('/me');
  const [categories = [], radiusM] = useWatch({ control, name: ['categories', 'radiusM'] });
  const categoryError = formState.errors.categories?.message;
  const categoryHint = categoryError ?? (isEditMode ? `${categories.length}개 선택` : '1개 이상');
  const baseLabel =
    preferences.data?.baseLat == null ? null : (readBaseLocationLabel() ?? '설정한 위치');

  const handleCategoryToggle = (category: Category) => {
    const next = categories.includes(category)
      ? categories.filter((item) => item !== category)
      : [...categories, category];
    setValue('categories', next, { shouldValidate: true, shouldDirty: true });
  };

  const handleValidSubmit = (form: PreferencesForm) => {
    updatePreferences.mutate(form, {
      onSuccess: () => {
        if (isEditMode) navigate('/me', myInfoNavigateOptions());
        else navigate('/onboarding/notifications');
      },
    });
  };

  if (preferences.isPending) return <LoadingState />;
  if (preferences.isError) {
    return <ErrorState error={preferences.error} onRetry={() => void preferences.refetch()} />;
  }

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={3} isEditMode={isEditMode} editTitle="좋아하는 가게·거리" />
      <form onSubmit={handleSubmit(handleValidSubmit)} className="px-5 pt-4">
        {!isEditMode && (
          <>
            <h1 className="text-2xl leading-snug font-bold">
              어떤 가게를,
              <br />
              어디까지 알려드릴까요?
            </h1>
            <p className="mt-2 text-sm text-muted">나중에 내 정보에서 바꿀 수 있어요</p>
          </>
        )}

        <div className={`${isEditMode ? 'mt-3' : 'mt-7'} mb-3 flex items-center justify-between`}>
          <h2 className="text-lg font-bold">좋아하는 가게</h2>
          <span className={`text-sm ${categoryError ? 'text-danger' : 'text-faint'}`}>
            {categoryHint}
          </span>
        </div>
        <CategoryPicker selected={categories} onToggle={handleCategoryToggle} />

        <h2 className="mt-7 mb-3 text-lg font-bold">걸어갈 수 있는 거리</h2>
        <RadiusPicker
          value={radiusM}
          onChange={(radiusM) => setValue('radiusM', radiusM, { shouldDirty: true })}
        />

        <h2 className="mt-7 mb-3 text-lg font-bold">기준 위치</h2>
        <BaseLocationCard label={baseLabel} onChange={() => navigate('/me/location')} />
        {updatePreferences.isError && (
          <p className="mt-3 text-sm text-danger">{toAppError(updatePreferences.error).message}</p>
        )}

        <BottomBar>
          <button
            type="submit"
            disabled={!formState.isValid || updatePreferences.isPending}
            className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
          >
            {isEditMode ? '저장하기' : '다음'}
          </button>
        </BottomBar>
      </form>
    </main>
  );
}
