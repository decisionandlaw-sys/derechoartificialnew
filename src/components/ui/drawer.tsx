import * as React from "react";

interface DrawerRootProps {
  children: React.ReactNode;
}

const Drawer = ({ children }: DrawerRootProps) => <>{children}</>;
Drawer.displayName = "Drawer";

const DrawerTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DrawerPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DrawerClose = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const DrawerOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ),
);
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ),
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, ...props }, ref) => (
    <h2 ref={ref} {...props}>
      {children}
    </h2>
  ),
);
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, ...props }, ref) => (
    <p ref={ref} {...props}>
      {children}
    </p>
  ),
);
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
