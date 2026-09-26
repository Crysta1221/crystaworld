import * as React from "react";
import {
  Info,
  Lightbulb,
  WarningCircle,
  Warning,
  WarningOctagon,
  type Icon,
} from "@phosphor-icons/react";

import { cn } from "@/shared/lib/utils";

export interface AlertProps extends React.ComponentProps<"div"> {
  title?: string;
  children?: React.ReactNode;
}

export function TitleContent({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="title-content" className={cn("font-semibold text-sm", className)} {...props}>
      {children}
    </div>
  );
}
TitleContent.displayName = "TitleContent";

export function Description({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="description"
      className={cn("text-sm/relaxed text-foreground/80", className)}
      {...props}
    >
      {children}
    </div>
  );
}
Description.displayName = "Description";

function isTitleElement(node: React.ReactNode): boolean {
  if (!React.isValidElement(node)) return false;
  const slot = (node.props as Record<string, unknown>)?.["data-slot"];
  if (slot === "title-content") return true;
  const typeName =
    typeof node.type === "string"
      ? node.type.toLowerCase()
      : (node.type as { displayName?: string; name?: string })?.displayName ||
        (node.type as { name?: string })?.name;
  return typeName === "TitleContent" || typeName === "titlecontent";
}

interface AlertContainerProps extends React.ComponentProps<"aside"> {
  icon: Icon;
  defaultTitle: string;
  title?: string;
  toneClass: string;
  badgeClass: string;
  titleClass: string;
}

function AlertContainer({
  icon: IconComponent,
  defaultTitle,
  title,
  toneClass,
  badgeClass,
  titleClass,
  children,
  className,
  ...props
}: AlertContainerProps) {
  const childrenArray = React.Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  );

  let titleNode = childrenArray.find(isTitleElement);
  const bodyNodes = childrenArray.filter((child) => child !== titleNode);

  if (!titleNode) {
    titleNode = <TitleContent>{title ?? defaultTitle}</TitleContent>;
  }

  return (
    <aside
      className={cn("my-5 rounded-2xl px-4 py-3.5", toneClass, className)}
      role="note"
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              badgeClass,
            )}
          >
            <IconComponent className="size-4" weight="fill" />
          </span>
          <div className={cn("min-w-0 text-sm leading-5 font-semibold text-balance", titleClass)}>
            {titleNode}
          </div>
        </div>
        {bodyNodes.length > 0 ? (
          <div className="mt-1.5 space-y-2 pl-9 text-sm text-foreground/85">{bodyNodes}</div>
        ) : null}
      </div>
    </aside>
  );
}

export function Note(props: AlertProps) {
  return (
    <AlertContainer
      icon={Info}
      defaultTitle="メモ"
      toneClass="bg-sky-500/10"
      badgeClass="bg-sky-500/15 text-sky-700 dark:text-sky-300"
      titleClass="text-sky-800 dark:text-sky-200"
      {...props}
    />
  );
}

export function Warn(props: AlertProps) {
  return (
    <AlertContainer
      icon={Warning}
      defaultTitle="注意"
      toneClass="bg-amber-500/10"
      badgeClass="bg-amber-500/15 text-amber-800 dark:text-amber-200"
      titleClass="text-amber-900 dark:text-amber-100"
      {...props}
    />
  );
}

export function WarningAlert(props: AlertProps) {
  return <Warn {...props} />;
}

export function Tip(props: AlertProps) {
  return (
    <AlertContainer
      icon={Lightbulb}
      defaultTitle="ヒント"
      toneClass="bg-primary/10"
      badgeClass="bg-primary/15 text-primary"
      titleClass="text-primary"
      {...props}
    />
  );
}

export function Important(props: AlertProps) {
  return (
    <AlertContainer
      icon={WarningCircle}
      defaultTitle="重要"
      toneClass="bg-purple-500/10"
      badgeClass="bg-purple-500/15 text-purple-700 dark:text-purple-300"
      titleClass="text-purple-800 dark:text-purple-200"
      {...props}
    />
  );
}

export function Caution(props: AlertProps) {
  return (
    <AlertContainer
      icon={WarningOctagon}
      defaultTitle="警告"
      toneClass="bg-rose-500/10"
      badgeClass="bg-rose-500/15 text-rose-700 dark:text-rose-300"
      titleClass="text-rose-800 dark:text-rose-200"
      {...props}
    />
  );
}
