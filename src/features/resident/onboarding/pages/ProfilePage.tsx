import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { toAppError } from '@/shared/lib/errors';
import { BottomBar } from '@/shared/ui/BottomBar';
import { LoadingState } from '@/shared/ui/LoadingState';

import { useMyProfile, useUpdateNickname } from '../../profile/hooks';
import { myInfoNavigateOptions } from '../../profile/myInfoToast';
import { MascotHintCard } from '../components/MascotHintCard';
import { NicknameField } from '../components/NicknameField';
import { NicknameSuggestions } from '../components/NicknameSuggestions';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { nicknameSchema, type NicknameForm } from '../schema';

interface ProfilePageProps {
  /** 생략하면 주소로 정한다: /me/nickname 이면 수정 */
  mode?: 'onboarding' | 'edit';
}

// 온보딩 2/4 닉네임 (피그마 R3), 내 정보 > 닉네임 수정 (R3-1)
export function ProfilePage({ mode }: ProfilePageProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const profile = useMyProfile();
  const updateNickname = useUpdateNickname();
  const { control, register, setValue, handleSubmit, formState } = useForm<NicknameForm>({
    resolver: zodResolver(nicknameSchema),
    mode: 'onChange',
    // 저장된 닉네임이 있으면 채워서 시작 (프로필을 읽은 뒤에 폼을 그린다)
    values: { nickname: profile.data?.nickname ?? '' },
  });

  const isEditMode = (mode ?? (pathname.startsWith('/me') ? 'edit' : 'onboarding')) === 'edit';
  const nicknameLength = useWatch({ control, name: 'nickname' }).length;
  const isEmpty = nicknameLength === 0;

  const handleValidSubmit = ({ nickname }: NicknameForm) => {
    updateNickname.mutate(nickname, {
      onSuccess: () => {
        if (isEditMode) navigate('/me', myInfoNavigateOptions());
        else navigate('/onboarding/preferences');
      },
    });
  };

  const handlePick = (nickname: string) => setValue('nickname', nickname, { shouldValidate: true });

  if (profile.isPending) return <LoadingState />;

  return (
    <main className="mx-auto min-h-dvh max-w-[480px] bg-surface">
      <OnboardingHeader step={2} isEditMode={isEditMode} editTitle="닉네임 수정" />
      <form onSubmit={handleSubmit(handleValidSubmit)} className="px-5 pt-4">
        <h1 className="text-2xl leading-snug font-bold">
          동네에서 불릴
          <br />
          {isEditMode ? '이름을 바꿔 주세요' : '이름을 정해 주세요'}
        </h1>
        <p className="mt-2 text-sm text-muted">
          앱에서 불릴 이름이에요. 다른 사람에게는 보이지 않아요
        </p>
        {isEmpty && <MascotHintCard />}
        <NicknameField
          registration={register('nickname')}
          length={nicknameLength}
          errorMessage={isEmpty ? undefined : formState.errors.nickname?.message}
          onClear={() => setValue('nickname', '', { shouldValidate: true })}
        />
        {isEmpty && <NicknameSuggestions onPick={handlePick} />}
        {updateNickname.isError && (
          <p className="mt-3 text-sm text-danger">{toAppError(updateNickname.error).message}</p>
        )}
        <BottomBar>
          <button
            type="submit"
            disabled={!formState.isValid || updateNickname.isPending}
            className="h-[52px] w-full rounded-[12px] bg-accent font-semibold text-white disabled:bg-accent-disabled"
          >
            {isEditMode ? '저장하기' : '다음'}
          </button>
        </BottomBar>
      </form>
    </main>
  );
}
