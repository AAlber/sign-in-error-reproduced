type SubNavigationTab = {
  title: string;
  page: number;
  icon: React.ReactNode;
  accessRoles?: ("moderator" | "educator" | "admin" | "member")[];
};

type SubNavigationBarProps = {
  tabs: NavigationTab[];
  page: number;
  setPage: (page: number) => void;
  layerId?: string;
};

type PageLayoutProps = {
  customHeader?: React.ReactNode;
  customFooter?: React.ReactNode;
  hasPadding: boolean;
  tabs: NavigationTab[];
  page: number;
  setPage: (page: number) => void;
  layerId?: string;
  children: React.ReactNode;
};

type NavigationOverlayProps = {
  customHeader?: React.ReactNode;
  children: React.ReactNode;
  customFooter?: React.ReactNode;
};
