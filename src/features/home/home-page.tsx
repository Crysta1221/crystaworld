import { Hobbies } from "./about/hobbies";
import { Skills } from "./about/skills-section";
import { SelfIntroduction } from "./about/self-introduction";
import { BackgroundTimeline } from "./background/background-timeline";
import { Donate } from "./donate/donate-section";
import { ProfileHeader } from "./profile/profile-header";
import { Socials } from "./socials/socials-section";

export function HomePage() {
  return (
    <div className="slide-enter-content flex flex-col gap-10 py-6 sm:gap-12 sm:py-8 lg:py-10">
      <ProfileHeader />
      <SelfIntroduction />
      <Skills />
      <BackgroundTimeline />
      <Hobbies />
      <Socials />
      <Donate />
      {/* RecentProjects is temporarily hidden. Re-enable with <RecentProjects />. */}
    </div>
  );
}
