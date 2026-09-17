import { useNavigate } from "react-router-dom";
import CareConnectLanding from "../components/ui/landing-page";

function Home() {
  const navigate = useNavigate();

  return (
    <CareConnectLanding
      onGetStarted={() => navigate("/careRequirement")}
      onExplore={() => navigate("/search")}
    />
  );
}

export default Home;