export interface FooterConfig {
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  quickLinks: {
    label: string;
    href: string;
  }[];
  resourceLinks: {
    label: string;
    href: string;
  }[];
}

export const footerConfig: FooterConfig = {
  contact: {
    email: "drazensimonovic18@gmail.com",
    phone: "+381 63 456 831",
    location: "Varvarin, Srbija"
  },
  socialMedia: {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#"
  },
  quickLinks: [
    { label: "Početna", href: "/" },
    { label: "Važna obaveštenja", href: "/vazna-obavestenja" },
    { label: "Forum", href: "/forum" },
    { label: "Kalendar aktivnosti", href: "/kalendar-aktivnosti" },
    { label: "Online obuke", href: "/online-obuke" }
  ],
  resourceLinks: [
    { label: "Priprema za nastavu", href: "/resursi-za-nastavu/priprema-za-nastavu" },
    { label: "Testovi", href: "/resursi-za-nastavu/testovi" },
    { label: "Domaći zadaci", href: "/resursi-za-nastavu/domaci-zadaci" },
    { label: "Operativni i globalni planovi", href: "/resursi-za-nastavu/operativni-i-globalni-planovi" }
  ]
};
