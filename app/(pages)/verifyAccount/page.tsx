import { verifyingEmailAction } from "@/libs/actions/verificationEmail.action";
import Link from "next/link";


interface verifyPageProps {
  searchParams: Promise<{ token: string }>;
}

const VerifyAccountPage = async ({ searchParams }: verifyPageProps) => {
  const currentSearchParams = await searchParams;
  const { token } = currentSearchParams;

  const result = await verifyingEmailAction(token)

  
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        {result?.success ? (
          <div className="bg-green-700 text-white p-2 rounded-md">{result.message}</div>
        ) : (
          <div className="bg-red-700 text-white p-2 rounded-md">{result.message}</div>
        ) }

        <Link href={"/login"} className="bg-slate-700 text-white mt-5 p-2 rounded-md hover:bg-slate-500">
          Go to Login Page
        </Link>
      </div>
    );
 
};

export default VerifyAccountPage;
