import { HomeSection } from '@/components/home/HomeSection';
import GoogleSignInButton from '@/components/home/SignIn_Google_Button';

const signin = () => {
  return (
    <HomeSection>
      <GoogleSignInButton />;
    </HomeSection>
  );
};

export default signin;
