"use client";

const ConfirmationPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-2xl font-semibold mb-4">Takk for din forespørsel!</h1>
    <p className="text-base text-[#797979] mb-8">
      Vi har mottatt din forespørsel og vil se på den så snart som mulig. Du vil høre fra oss på e-post eller telefon når vi har vurdert oppdraget.
    </p>
    <div className="text-4xl mb-4">🎉</div>
    <a href="https://mendi.app/" className="text-[#006EFF] underline">Tilbake til hjemmesiden</a>
  </div>
);

export default ConfirmationPage; 