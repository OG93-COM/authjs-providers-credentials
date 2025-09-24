interface verifyPageProps {
    searchParams : Promise<{token : string}>
}

const VerifyAccountPage = async ({searchParams} : verifyPageProps) => {
    const currentSearchParams = await searchParams;
  return (
    <div>
        Account Verified {currentSearchParams.token}
    </div>
  )
}

export default VerifyAccountPage