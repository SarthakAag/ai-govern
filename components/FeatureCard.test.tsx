// components/FeatureCard.test.tsx
import { render, screen } from "@testing-library/react";
import FeatureCard from "./FeatureCard";

describe("FeatureCard", () => {
  it("renders title, description, and links to the correct href", () => {
    render(
      <FeatureCard
        emoji="🤖"
        title="AI Civic Assistant"
        description="Ask about government services"
        href="/chatbot"
        accent="saffron"
      />
    );

    expect(screen.getByText("AI Civic Assistant")).toBeInTheDocument();
    expect(screen.getByText("Ask about government services")).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/chatbot");
  });
});