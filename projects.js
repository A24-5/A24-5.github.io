// Liste des réalisations du portfolio LEARNEO.
// Pour ajouter une vidéo : déposez le fichier dans assets/videos/ et son image dans assets/posters/,
// puis ajoutez une entrée ci-dessous (même "id" que le nom des fichiers).
window.CATEGORIES = [
  { id: "all",     label: "Tout" },
  { id: "pub",     label: "Publicités" },
  { id: "sante",   label: "Santé publique" },
  { id: "ia",      label: "Contenus IA & éducatifs" },
  { id: "marque",  label: "Marque & présentation" },
  { id: "story",   label: "Bande-annonce" }
];

window.PROJECTS = [
  {
    id: "dopam-pub-60s", cat: "pub", format: "9:16", duration: "1:00",
    client: "Ets DOPAM · Instruments de musique",
    title: "Publicité 60 s : enceintes, batteries et claviers",
    desc: "Spot vertical pour un vendeur d'instruments de musique basé à Djèrègbé : mise en scène des produits (amplis, batteries, claviers), message de marque et appel à contacter sur WhatsApp."
  },
  {
    id: "dopam-pub-court", cat: "pub", format: "9:16", duration: "0:43",
    client: "Ets DOPAM · Instruments de musique",
    title: "Commander sans boutique, en 3 étapes",
    desc: "Vidéo explicative en illustration isométrique : comment commander sur devis, connaître le prix avant de valider et se faire livrer, pour les églises, groupes et passionnés de musique."
  },
  {
    id: "import-chine-pub", cat: "pub", format: "9:16", duration: "0:58",
    client: "Formation « Importer depuis la Chine »",
    title: "Publicité de lancement de la formation",
    desc: "Spot dynamique qui interpelle les jeunes entrepreneurs, montre le suivi des colis et invite à s'inscrire par WhatsApp."
  },
  {
    id: "import-chine-9x16", cat: "pub", format: "9:16", duration: "0:56",
    client: "Formation « Importer depuis la Chine »",
    title: "Ce que tu apprendras : de la commande au retrait",
    desc: "Version pédagogique : trouver ses fournisseurs, payer ses articles, expédier sans tracas et éviter les arnaques, jusqu'au colis retiré."
  },
  {
    id: "tchigan-bouillie", cat: "pub", format: "9:16", duration: "0:35",
    client: "TCHIGAN Bouillie · Produit alimentaire",
    title: "Spot produit 35 s : « Le choix naturel »",
    desc: "Publicité appétissante pour une bouillie 100 % naturelle à base de soja : ambiance chaleureuse, mise en valeur du paquet et numéros de commande."
  },
  {
    id: "treats-aritioluwa", cat: "pub", format: "9:16", duration: "0:45",
    client: "Treats by aritiOluwa · Pâtisserie",
    title: "Popcorns croustillants & cupcakes moelleux",
    desc: "Pub gourmande de 45 s pensée pour les statuts WhatsApp : typographie élégante, gros plans produits et appel à commander."
  },
  {
    id: "medimap", cat: "sante", format: "16:9", duration: "3:18",
    client: "MEDIMAP · Application de santé",
    title: "Présentation de l'application MEDIMAP",
    desc: "Vidéo de présentation d'une solution qui géolocalise les structures de santé : le constat, les fonctionnalités (carte interactive, avis, tableau de bord) et les bénéfices pour les citoyens."
  },
  {
    id: "ia-sante-publique", cat: "sante", format: "16:9", duration: "3:00",
    client: "Santé publique · Communication",
    title: "IA et motion design au service de la santé publique",
    desc: "Comment transmettre efficacement un message de santé : un personnage guide le spectateur à travers les étapes, avec l'exemple de la vaccination."
  },
  {
    id: "learneo-johnlex", cat: "marque", format: "16:9", duration: "2:02",
    client: "LEARNEO",
    title: "Présentation de LEARNEO et de son fondateur",
    desc: "La communication digitale évolue : qui est Johnlex DOHOUNON, son expertise (vidéos publicitaires, visuels, contenus réseaux sociaux) et l'univers LEARNEO."
  },
  {
    id: "learneo-explicatif", cat: "marque", format: "16:9", duration: "1:23",
    client: "LEARNEO",
    title: "Pourquoi le motion design fonctionne",
    desc: "L'histoire de « Chez Kofi » : une petite entreprise qui gagne en visibilité grâce à une vidéo animée. Attention immédiate, message simplifié, image de marque, partage facile."
  },
  {
    id: "motion-design-claude", cat: "marque", format: "16:9", duration: "1:24",
    client: "LEARNEO · Showreel",
    title: "Vos formats, vos outils : la palette LEARNEO",
    desc: "Démonstration des savoir-faire : animation de logo, données animées, publicités sociales, transitions et effets, et tous les formats de livraison."
  },
  {
    id: "presentation-johnlex", cat: "marque", format: "9:16", duration: "0:44",
    client: "LEARNEO",
    title: "Présentation personnelle en format vertical",
    desc: "Une carte de visite animée pour les réseaux : entrepreneur, créateur de contenu, IA et digital, avec un appel à l'action en commentaire."
  },
  {
    id: "mythe-ia", cat: "ia", format: "9:16", duration: "2:02",
    client: "LEARNEO · Contenu éducatif",
    title: "Le vrai danger, ce n'est pas l'IA",
    desc: "Vidéo de sensibilisation illustrée : l'IA prend en charge les tâches répétitives, le vrai risque est de rester immobile. À chacun de choisir : la subir ou s'en servir."
  },
  {
    id: "trois-taches-ia", cat: "ia", format: "9:16", duration: "1:00",
    client: "LEARNEO · Astuce IA",
    title: "3 tâches à confier à l'IA en entreprise",
    desc: "Gestion des e-mails, tâches administratives et suivi des clients : interface animée façon tableau de bord, pour un public de PME."
  },
  {
    id: "trois-taches-ia-pme", cat: "ia", format: "9:16", duration: "0:38",
    client: "LEARNEO · Astuce IA",
    title: "3 tâches répétitives à automatiser dans votre PME",
    desc: "Répondre aux clients, créer ses publications, rédiger devis et relances : un format court et rythmé pour les réseaux."
  },
  {
    id: "cinq-erreurs-ia", cat: "ia", format: "9:16", duration: "1:15",
    client: "LEARNEO · Guide pratique",
    title: "5 erreurs à éviter dans vos logos et affiches IA",
    desc: "Un personnage 2D présente les pièges courants (lisibilité, identité visuelle…) et introduit le guide pratique LEARNEO."
  },
  {
    id: "trop-pauvre-preface", cat: "story", format: "9:16", duration: "1:58",
    client: "StoryMind · Édition",
    title: "« Trop pauvre pour exister » : préface animée",
    desc: "Bande-annonce narrative d'un livre en 17 chapitres sur les inégalités dans l'enseignement supérieur : personnages, ambiance dramatique et typographie forte."
  }
];
