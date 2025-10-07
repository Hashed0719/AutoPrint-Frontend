import { MerchantAuthForm } from "@/components/auth/MerchantAuthForm";
import AppLayout from "@/components/layout/AppLayout";

const MerchantAuth = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-md">
          <MerchantAuthForm/>
      </div>
    </AppLayout>
  );
};

export default MerchantAuth;
