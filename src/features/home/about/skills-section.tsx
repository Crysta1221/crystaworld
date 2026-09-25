import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

import { useLocale } from "@/features/locale";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { SKILL_LEVEL_LABELS, SKILL_LEVELS, SKILLS } from "./skills";
import type { SkillLevel } from "./skills";

const PREVIEW_COUNT = 6;

type Skill = (typeof SKILLS)[number];

/**
 * Discrete skill meters under Hobbies.
 * The first six stay visible; the rest open and close in one height animation.
 */
export function Skills() {
  const { locale } = useLocale();
  const labels = SKILL_LEVEL_LABELS[locale];
  const [expanded, setExpanded] = useState(false);
  const preview = SKILLS.slice(0, PREVIEW_COUNT);
  const rest = SKILLS.slice(PREVIEW_COUNT);

  return (
    <section aria-labelledby="skills-heading">
      <h2
        id="skills-heading"
        className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
      >
        Skills
      </h2>
      <ul className="mt-6 grid gap-x-12 gap-y-6 lg:grid-cols-2">
        {preview.map((skill) => (
          <SkillItem key={skill.id} skill={skill} label={labels[skill.level]} />
        ))}
      </ul>
      {rest.length > 0 ? (
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-500 ease-out",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden" inert={expanded ? undefined : true}>
            <ul
              id="skills-rest"
              className={cn(
                "grid gap-x-12 gap-y-6 pt-6 transition-opacity duration-500 ease-out lg:grid-cols-2",
                expanded ? "opacity-100" : "opacity-0",
              )}
            >
              {rest.map((skill) => (
                <SkillItem key={skill.id} skill={skill} label={labels[skill.level]} />
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      {rest.length > 0 ? (
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-auto px-5 py-2"
            aria-expanded={expanded}
            aria-controls="skills-rest"
            onClick={() => setExpanded((open) => !open)}
          >
            {expanded
              ? locale === "ja"
                ? "折りたたむ"
                : "Show less"
              : locale === "ja"
                ? "すべて表示"
                : "View all"}
            <CaretDownIcon
              className={cn("transition-transform duration-300", expanded && "rotate-180")}
              aria-hidden
            />
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function SkillItem({ skill, label }: { skill: Skill; label: string }) {
  const levelIndex = SKILL_LEVELS.indexOf(skill.level);

  return (
    <li>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <img src={skill.logo} alt="" width={20} height={20} className="size-5 object-contain" />
        </span>
        <p className="min-w-0 text-sm font-medium text-foreground">{skill.name}</p>
      </div>
      <div className="pl-13">
        <SkillMeter level={skill.level} label={label} levelIndex={levelIndex} />
      </div>
    </li>
  );
}

function SkillMeter({
  level,
  label,
  levelIndex,
}: {
  level: SkillLevel;
  label: string;
  levelIndex: number;
}) {
  const lastIndex = SKILL_LEVELS.length - 1;
  const stop = `${(levelIndex / lastIndex) * 100}%`;

  return (
    <div className="relative mt-3 h-12">
      <div className="absolute inset-x-1.5 top-1.5 h-3">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        {SKILL_LEVELS.map((stopLevel, index) => {
          const active = stopLevel === level;
          const position = `${(index / lastIndex) * 100}%`;

          return (
            <span
              key={stopLevel}
              aria-hidden
              className={cn(
                "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full",
                active ? "size-3.5 bg-primary" : "size-2 bg-muted-foreground/35",
              )}
              style={{ left: position }}
            />
          );
        })}
        <p
          className={cn(
            "absolute top-6 text-xs whitespace-nowrap text-muted-foreground",
            levelIndex === 0 && "left-0",
            levelIndex === lastIndex && "right-0",
            levelIndex > 0 && levelIndex < lastIndex && "-translate-x-1/2",
          )}
          style={levelIndex > 0 && levelIndex < lastIndex ? { left: stop } : undefined}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
