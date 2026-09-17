import { useNavigate } from "react-router-dom";
import { FeatureSteps } from "../components/ui/feature-section";

const features = [
  {
    step: "Step 1",
    title: "Tell Us Your Needs",
    content:
      "Choose the type of care you need and tell us about your requirements.",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1000&q=80",
  },
  {
    step: "Step 2",
    title: "Find the Right Caregiver",
    content:
      "Explore caregivers based on location, availability, experience and cost.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    step: "Step 3",
    title: "Book Your Care",
    content:
      "Select your preferred caregiver and continue to booking.",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80",
  },
];

function CareRequirement() {
  const navigate = useNavigate();

  return (
    <FeatureSteps
      features={features}
      title="Tell Us What You Need"
      autoPlayInterval={4000}
      onComplete={() => navigate("/search")}
    />
  );
}

export default CareRequirement;