import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useMyProfile, useUpdateNickname } from '../../profile/hooks';
import { NicknameField } from '../components/NicknameField';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { nicknameSchema, type NicknameForm } from '../schema';

// 온보딩 2/4 닉네임 (피그마 R3), 내 정보 > 수정 (R3-1)
export function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const profile = useMyProfile();
  const updateNickname = useUpdateNickname();
  const { control, register, setValue, handleSubmit, formState } = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
    // 저장된 닉네임이 있으면 채워서 시작 (프로필을 읽은 뒤에 폼을 그린다)
    values: { nickname: profile.data?.nickname ?? '' },
  });

  const isEditMode = searchParams.get('mode') === 'edit';
  const nicknameLength = useWatch({ control, name: 'nickname' }).length;

  const handleValidSubmit = ({ nickname }: NicknameForm) => {
    updateNickname.mutate(nickname, {
      onSuccess: () => navigate(isEditMode ? '/me' : '/onboarding/preferences'),
    });
  };

  if (profile.isPending) return <LoadingState />;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={2} isEditMode={isEditMode} editTitle="닉네임 수정" />
      <form onSubmit={handleSubmit(handleValidSubmit)} className="px-5 pt-4">
        <h1 className="text-2xl leading-snug font-bold">
          동네에서 불릴
          <br />
          이름을 정해 주세요
        </h1>
        <p className="mt-2 text-sm text-muted">
          앱에서 불릴 이름이에요. 다른 사람에게는 보이지 않아요
        </p>
        <NicknameField
          registration={register('nickname')}
          length={nicknameLength}
          errorMessage={nicknameLength > 0 ? formState.errors.nickname?.message : undefined}
          onClear={() => setValue('nickname', '', { shouldValidate: true })}
        />
        {updateNickname.isError && (
          <p className="mt-3 text-sm text-danger">{toAppError(updateNickname.error).message}</p>
        )}
        <BottomBar>
          <button
            type="submit"
            disabled={!formState.isValid || updateNickname.isPending}
            className="h-14 w-full rounded-card bg-accent font-semibold text-white disabled:bg-accent-tint disabled:text-faint"
          >
            {isEditMode ? '저장' : '다음'}
          </button>
        </BottomBar>
      </form>
    </main>
  );
}
