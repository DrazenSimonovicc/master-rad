// Breadcrumb data for different pages
export const getBreadcrumbData = (pathname: string) => {
  const breadcrumbMap: Record<string, Array<{ title: string; url?: string }>> = {
    '/': [
      { title: "Početak" }
    ],
    '/forum': [
      { title: "Početak", url: "/" },
      { title: "Forum" }
    ],
    '/vazna-obavestenja': [
      { title: "Početak", url: "/" },
      { title: "Važna obaveštenja" }
    ],
    '/kalendar-aktivnosti': [
      { title: "Početak", url: "/" },
      { title: "Kalendar aktivnosti" }
    ],
    '/online-obuke': [
      { title: "Početak", url: "/" },
      { title: "Online obuke" }
    ],
    '/resursi-za-nastavu': [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu" }
    ],
    '/resursi-za-nastavu/priprema-za-nastavu': [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Priprema za nastavu" }
    ],
    '/resursi-za-nastavu/domaci-zadaci': [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Domaći zadaci" }
    ],
    '/resursi-za-nastavu/testovi': [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Testovi" }
    ],
    '/resursi-za-nastavu/operativni-i-globalni-planovi': [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Operativni i globalni planovi" }
    ],
    '/profil': [
      { title: "Početak", url: "/" },
      { title: "Profil" }
    ],
    '/podaci-o-korisniku': [
      { title: "Početak", url: "/" },
      { title: "Podaci o korisniku" }
    ],
    '/o-autoru': [
      { title: "Početak", url: "/" },
      { title: "O autoru" }
    ]
  };

  // Check for dynamic routes (with [id])
  if (pathname.includes('/vazna-obavestenja/') && pathname !== '/vazna-obavestenja') {
    return [
      { title: "Početak", url: "/" },
      { title: "Važna obaveštenja", url: "/vazna-obavestenja" },
      { title: "Obaveštenje" }
    ];
  }

  if (pathname.includes('/forum/') && pathname !== '/forum') {
    return [
      { title: "Početak", url: "/" },
      { title: "Forum", url: "/forum" },
      { title: "Tema" }
    ];
  }

  if (pathname.includes('/kalendar-aktivnosti/') && pathname !== '/kalendar-aktivnosti') {
    return [
      { title: "Početak", url: "/" },
      { title: "Kalendar aktivnosti", url: "/kalendar-aktivnosti" },
      { title: "Aktivnost" }
    ];
  }

  if (pathname.includes('/resursi-za-nastavu/priprema-za-nastavu/') && pathname !== '/resursi-za-nastavu/priprema-za-nastavu') {
    return [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Priprema za nastavu", url: "/resursi-za-nastavu/priprema-za-nastavu" },
      { title: "Materijal" }
    ];
  }

  if (pathname.includes('/resursi-za-nastavu/domaci-zadaci/') && pathname !== '/resursi-za-nastavu/domaci-zadaci') {
    return [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Domaći zadaci", url: "/resursi-za-nastavu/domaci-zadaci" },
      { title: "Zadatak" }
    ];
  }

  if (pathname.includes('/resursi-za-nastavu/testovi/') && pathname !== '/resursi-za-nastavu/testovi') {
    return [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Testovi", url: "/resursi-za-nastavu/testovi" },
      { title: "Test" }
    ];
  }

  if (pathname.includes('/resursi-za-nastavu/operativni-i-globalni-planovi/') && pathname !== '/resursi-za-nastavu/operativni-i-globalni-planovi') {
    return [
      { title: "Početak", url: "/" },
      { title: "Resursi za nastavu", url: "/resursi-za-nastavu" },
      { title: "Operativni i globalni planovi", url: "/resursi-za-nastavu/operativni-i-globalni-planovi" },
      { title: "Plan" }
    ];
  }

  return breadcrumbMap[pathname] || [
    { title: "Početak", url: "/" },
    { title: "Stranica" }
  ];
};
