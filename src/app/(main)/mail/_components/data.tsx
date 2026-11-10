import { Archive, CircleHelp, File, Inbox, Keyboard, type LucideIcon, Send, Star, Trash2 } from "lucide-react";
import { siFigma, siGoogledocs, siGooglephotos } from "simple-icons";

const arhamKhan = {
  name: "Arham Khan",
  email: "hello@arhamkhnz.com",
};

const weblabsStudio = {
  name: "Weblabs Studio",
  email: "contact@weblabs.studio",
};

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const hoursAgo = (hours: number) => minutesAgo(hours * 60);
const daysAgo = (days: number) => hoursAgo(days * 24);

export type Recipient = {
  name: string;
  email: string;
};

export type Attachment = {
  id: string;
  name: string;
  size: string;
  icon: typeof siFigma;
};

export type Mail = {
  id: string;
  accountId: number;
  from: Recipient;
  to: Recipient[];
  cc?: Recipient[];
  subject: string;
  body: string;
  receivedAt: string;
  folder: "inbox" | "drafts" | "sent" | "archive" | "trash";
  isRead: boolean;
  isPinned: boolean;
  isPriority: boolean;
  labels: string[];
  attachments?: Attachment[];
  messageCount?: number;
};

export type MailNavItem = {
  id: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  isActive: boolean;
};

type MailNavigation = {
  navMain: MailNavItem[];
  folders: MailNavItem[];
  navFooter: MailNavItem[];
};

export const mails: Mail[] = [
  {
    id: "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    accountId: 1,
    from: {
      name: "William Smith",
      email: "williamsmith@example.com",
    },
    to: [arhamKhan],
    cc: [weblabsStudio],
    subject: "Reunião amanhã",
    body: "Olá, vamos fazer uma reunião amanhã para discutir o projeto. Revisei os detalhes do projeto e tenho algumas ideias que gostaria de compartilhar. É fundamental que estejamos alinhados sobre os próximos passos para garantir o sucesso do projeto.\n\nPor favor, venha preparado com quaisquer dúvidas ou insights que você tenha. Mal posso esperar pela nossa reunião!\n\nAtenciosamente, William",
    receivedAt: minutesAgo(24),
    folder: "inbox",
    isRead: true,
    isPinned: true,
    isPriority: true,
    labels: ["meeting", "work", "important"],
    attachments: [
      {
        id: "studio-admin-fig",
        name: "studio-admin.fig",
        size: "21 MB",
        icon: siFigma,
      },
      {
        id: "features-docx",
        name: "features.docx",
        size: "3.7 MB",
        icon: siGoogledocs,
      },
      {
        id: "preview-png",
        name: "preview.png",
        size: "2.3 MB",
        icon: siGooglephotos,
      },
    ],
  },
  {
    id: "110e8400-e29b-11d4-a716-446655440000",
    accountId: 2,
    from: {
      name: "Alice Smith",
      email: "alicesmith@example.com",
    },
    to: [weblabsStudio],
    subject: "Re: Atualização do projeto",
    body: "Obrigado pela atualização do projeto. Ficou ótimo! Li o relatório e o progresso é impressionante. A equipe fez um trabalho excelente, e eu aprecio o esforço que todos dedicaram.\n\nTenho algumas sugestões menores que incluirei no documento anexado.\n\nVamos discutir isso na próxima reunião. Continuem com o excelente trabalho!\n\nAtenciosamente, Alice",
    receivedAt: hoursAgo(2),
    folder: "inbox",
    isRead: true,
    isPinned: true,
    isPriority: false,
    labels: ["work", "important"],
    attachments: [
      {
        id: "project-notes-docx",
        name: "project-notes.docx",
        size: "1.8 MB",
        icon: siGoogledocs,
      },
    ],
    messageCount: 3,
  },
  {
    id: "3e7c3f6d-bdf5-46ae-8d90-171300f27ae2",
    accountId: 1,
    from: {
      name: "Bob Johnson",
      email: "bobjohnson@example.com",
    },
    to: [arhamKhan],
    subject: "Planos para o fim de semana",
    body: "Tem planos para o fim de semana? Estava pensando em fazer uma trilha nas montanhas próximas. Faz tempo que não nos divertimos ao ar livre.\n\nSe tiver interesse, me avise que combinamos os detalhes. Será uma ótima forma de relaxar e aproveitar a natureza.\n\nAguardo sua resposta!\n\nAbraços, Bob",
    receivedAt: daysAgo(1),
    folder: "inbox",
    isRead: true,
    isPinned: true,
    isPriority: false,
    labels: ["personal"],
  },
  {
    id: "61c35085-72d7-42b4-8d62-738f700d4b92",
    accountId: 1,
    from: {
      name: "Emily Davis",
      email: "emilydavis@example.com",
    },
    to: [arhamKhan],
    subject: "Re: Dúvida sobre orçamento",
    body: "Tenho uma dúvida sobre o orçamento do próximo projeto. Parece que há uma divergência na alocação de recursos.\n\nRevisei o relatório de orçamento e identifiquei algumas áreas em que talvez possamos otimizar os gastos sem comprometer a qualidade do projeto.\n\nAnexei uma análise detalhada para referência. Vamos conversar mais sobre isso na próxima reunião.\n\nObrigado(a), Emily",
    receivedAt: daysAgo(2),
    folder: "inbox",
    isRead: false,
    isPinned: true,
    isPriority: true,
    labels: ["work", "budget"],
    attachments: [
      {
        id: "budget-analysis-docx",
        name: "budget-analysis.docx",
        size: "2.1 MB",
        icon: siGoogledocs,
      },
    ],
    messageCount: 2,
  },
  {
    id: "8f7b5db9-d935-4e42-8e05-1f1d0a3dfb97",
    accountId: 2,
    from: {
      name: "Michael Wilson",
      email: "michaelwilson@example.com",
    },
    to: [weblabsStudio],
    subject: "Comunicado importante",
    body: "Tenho um comunicado importante a fazer durante a reunião de equipe. Trata-se de uma mudança estratégica na nossa abordagem ao próximo lançamento de produto. Recebemos feedback valioso dos testadores beta, e acredito que é hora de fazer alguns ajustes para atender melhor às necessidades dos nossos clientes.\n\nEssa mudança é crucial para o nosso sucesso, e estou ansioso para discuti-la com a equipe. Por favor, venham preparados para compartilhar suas percepções durante a reunião.\n\nAtenciosamente, Michael",
    receivedAt: daysAgo(3),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: true,
    labels: ["meeting", "work", "important"],
  },
  {
    id: "1f0f2c02-e299-40de-9b1d-86ef9e42126b",
    accountId: 1,
    from: {
      name: "Sarah Brown",
      email: "sarahbrown@example.com",
    },
    to: [arhamKhan],
    subject: "Re: Feedback sobre a proposta",
    body: "Obrigado pelo feedback sobre a proposta. Ficou ótimo! Fico feliz em saber que achou promissora. A equipe trabalhou com dedicação para abordar todos os pontos-chave que você levantou, e acredito que agora temos uma base sólida para o projeto.\n\nAnexei a proposta revisada para sua análise.\n\nPor favor, me avise se tiver mais comentários ou sugestões. Aguardo sua resposta.\n\nAtenciosamente, Sarah",
    receivedAt: daysAgo(5),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["work"],
    attachments: [
      {
        id: "proposal-layout-fig",
        name: "proposal-layout.fig",
        size: "14 MB",
        icon: siFigma,
      },
    ],
  },
  {
    id: "17c0a96d-4415-42b1-8b4f-764efab57f66",
    accountId: 2,
    from: {
      name: "David Lee",
      email: "davidlee@example.com",
    },
    to: [weblabsStudio],
    cc: [arhamKhan],
    subject: "Nova ideia de projeto",
    body: "Tenho uma ideia nova e empolgante de projeto para discutir com você. Envolve expandir nossos serviços para um mercado de nicho que mostrou crescimento considerável nos últimos meses.\n\nPreparei uma proposta detalhada com os benefícios potenciais e a estratégia de execução.\n\nEsse projeto tem potencial de impactar positivamente e significativamente o nosso negócio. Vamos marcar uma reunião para explorar os detalhes e determinar se está alinhado aos nossos objetivos atuais.\n\nAtenciosamente, David",
    receivedAt: daysAgo(8),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["meeting", "work", "important"],
  },
  {
    id: "2f0130cb-39fc-44c4-bb3c-0a4337edaaab",
    accountId: 1,
    from: {
      name: "Olivia Wilson",
      email: "oliviawilson@example.com",
    },
    to: [arhamKhan],
    subject: "Planos de férias",
    body: "Vamos planejar nossas férias para o mês que vem. O que acha? Estava pensando em visitar um paraíso tropical e reuni algumas opções de destino.\n\nAcho que está na hora de relaxar e recarregar as energias. Dê uma olhada nas opções e me diga suas preferências.\n\nPodemos começar a fazer os preparativos para garantir uma viagem tranquila e agradável.\n\nAnsioso pelo seu retorno! Olivia",
    receivedAt: daysAgo(12),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["personal"],
  },
  {
    id: "de305d54-75b4-431b-adb2-eb6b9e546014",
    accountId: 2,
    from: {
      name: "James Martin",
      email: "jamesmartin@example.com",
    },
    to: [weblabsStudio],
    subject: "Re: Inscrição na conferência",
    body: "Concluí a inscrição para a conferência do mês que vem. O evento promete ser uma ótima oportunidade de networking, e estou ansioso para participar das diversas sessões e conectar-me com especialistas do setor.\n\nTambém anexei a programação da conferência para referência.\n\nSe houver algum tema ou sessão específica que você queira que eu explore, por favor me avise. É um evento empolgante, e vou aproveitar ao máximo.\n\nAtenciosamente, James",
    receivedAt: daysAgo(18),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["work", "conference"],
    attachments: [
      {
        id: "conference-schedule-png",
        name: "conference-schedule.png",
        size: "860 KB",
        icon: siGooglephotos,
      },
    ],
  },
  {
    id: "7dd90c63-00f6-40f3-bd87-5060a24e8ee7",
    accountId: 1,
    from: {
      name: "Sophia White",
      email: "sophiawhite@example.com",
    },
    to: [arhamKhan],
    subject: "Jantar de equipe",
    body: "Vamos fazer um jantar de equipe na próxima semana para celebrar nosso sucesso. Alcançamos alguns marcos significativos, e é hora de reconhecer nosso trabalho duro e dedicação.\n\nFiz reservas em um restaurante encantador, e tenho certeza de que será uma noite agradável.\n\nPor favor, confirme sua disponibilidade e preferências alimentares. Aguardo um jantar divertido e memorável com a equipe!\n\nAbraços, Sophia",
    receivedAt: daysAgo(24),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["meeting", "work"],
  },
  {
    id: "99a88f78-3eb4-4d87-87b7-7b15a49a0a05",
    accountId: 2,
    from: {
      name: "Daniel Johnson",
      email: "danieljohnson@example.com",
    },
    to: [weblabsStudio],
    subject: "Pedido de feedback",
    body: "Gostaria do seu feedback sobre as últimas entregas do projeto. Fizemos um progresso significativo, e valorizo a sua contribuição para garantir que estamos no caminho certo.\n\nAnexei as entregas para sua análise, e estou particularmente interessado em qualquer área em que você acha que podemos melhorar ainda mais a qualidade ou a eficiência.\n\nSeu feedback é inestimável, e agradeço seu tempo e expertise. Vamos trabalhar juntos para fazer deste projeto um sucesso.\n\nAtenciosamente, Daniel",
    receivedAt: daysAgo(31),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["work"],
  },
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    accountId: 1,
    from: {
      name: "Ava Taylor",
      email: "avataylor@example.com",
    },
    to: [arhamKhan],
    subject: "Re: Pauta da reunião",
    body: "Segue a pauta da nossa reunião na próxima semana. Incluí todos os tópicos que precisamos abordar, bem como a alocação de tempo para cada um.\n\nSe tiver algum item adicional para discutir ou qualquer ponto específico para tratar, por favor me avise, e podemos integrá-los à pauta.\n\nÉ essencial que a nossa reunião seja produtiva e aborde todas as questões relevantes.\n\nAguardo nossa reunião! Ava",
    receivedAt: daysAgo(45),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["meeting", "work"],
  },
  {
    id: "c1a0ecb4-2540-49c5-86f8-21e5ce79e4e6",
    accountId: 2,
    from: {
      name: "William Anderson",
      email: "williamanderson@example.com",
    },
    to: [weblabsStudio],
    subject: "Atualização do lançamento do produto",
    body: "O lançamento do produto está no prazo. Enviarei uma atualização durante a nossa chamada. Tivemos um progresso substancial no desenvolvimento e no marketing do nosso novo produto.\n\nMal posso esperar para compartilhar as últimas novidades com você na próxima chamada. É fundamental coordenarmos nossos esforços para garantir um lançamento bem-sucedido. Por favor, venha preparado com quaisquer dúvidas ou insights que tenha.\n\nVamos fazer deste lançamento um grande sucesso!\n\nAtenciosamente, William",
    receivedAt: daysAgo(62),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["meeting", "work", "important"],
  },
  {
    id: "ba54eefd-4097-4949-99f2-2a9ae4d1a836",
    accountId: 1,
    from: {
      name: "Mia Harris",
      email: "miaharris@example.com",
    },
    to: [arhamKhan],
    subject: "Re: Roteiro de viagem",
    body: "Recebi o roteiro de viagem. Ficou ótimo! Obrigado pela assistência rápida em organizar os detalhes. Revisei a agenda e as acomodações, e tudo parece estar em ordem. Estou ansioso pela viagem, e confio de que será uma experiência tranquila e agradável.\n\nSe houver alguma atividade ou atração específica que você recomende no destino, sinta-se à vontade para compartilhar suas sugestões.\n\nAnsiosa pela viagem! Mia",
    receivedAt: daysAgo(75),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["personal", "travel"],
  },
  {
    id: "df09b6ed-28bd-4e0c-85a9-9320ec5179aa",
    accountId: 2,
    from: {
      name: "Ethan Clark",
      email: "ethanclark@example.com",
    },
    to: [weblabsStudio],
    subject: "Evento de integração de equipe",
    body: "Vamos planejar um evento de integração para o nosso departamento. A coesão e o moral da equipe são vitais para o nosso sucesso, e acredito que um evento de integração bem organizado pode ser incrivelmente benéfico. Fiz uma pesquisa e tenho algumas ideias de atividades divertidas e envolventes.\n\nPor favor, me diga o que acha e sua disponibilidade. Queremos que esse evento seja agradável e produtivo.\n\nJuntos, vamos fortalecer nossa equipe e melhorar nosso desempenho.\n\nAtenciosamente, Ethan",
    receivedAt: daysAgo(92),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["meeting", "work"],
  },
  {
    id: "d67c1842-7f8b-4b4b-9be1-1b3b1ab4611d",
    accountId: 1,
    from: {
      name: "Chloe Hall",
      email: "chloehall@example.com",
    },
    to: [arhamKhan],
    subject: "Re: Aprovação do orçamento",
    body: "O orçamento foi aprovado. Podemos prosseguir com o projeto. É com satisfação que informo que a nossa proposta de orçamento recebeu sinal verde do departamento financeiro. Este é um marco significativo, e significa que podemos seguir o projeto conforme o planejado.\n\nAnexei o orçamento finalizado para referência. Vamos garantir que permaneçamos no caminho certo e entreguemos o projeto no prazo e dentro do orçamento.\n\nÉ um momento empolgante para nós! Chloe",
    receivedAt: daysAgo(118),
    folder: "inbox",
    isRead: true,
    isPinned: false,
    isPriority: false,
    labels: ["work", "budget"],
  },
  {
    id: "6c9a7f94-8329-4d70-95d3-51f68c186ae1",
    accountId: 2,
    from: {
      name: "Samuel Turner",
      email: "samuelturner@example.com",
    },
    to: [weblabsStudio],
    subject: "Trilha no fim de semana",
    body: "Quem topa uma trilha de fim de semana nas montanhas? Estou precisando de uma aventura ao ar livre, e uma caminhada nas montanhas parece a fuga perfeita. Se estiver disposto(a) ao desafio, podemos explorar trilhas cenográficas e aproveitar a beleza da natureza.\n\nPesquisei um pouco e já tenho algumas rotas em mente.\n\nMe avise se tiver interesse, e combinamos os detalhes.\n\nCom certeza será uma experiência memorável! Samuel",
    receivedAt: daysAgo(145),
    folder: "inbox",
    isRead: false,
    isPinned: false,
    isPriority: false,
    labels: ["personal"],
  },
];

export const mailNavigation: MailNavigation = {
  navMain: [
    {
      id: "inbox",
      title: "Caixa de entrada",
      label: "18",
      icon: Inbox,
      isActive: true,
    },
    {
      id: "priority",
      title: "Prioridade",
      label: "3",
      icon: Star,
      isActive: false,
    },
  ],
  folders: [
    {
      id: "drafts",
      title: "Rascunhos",
      label: "9",
      icon: File,
      isActive: false,
    },
    {
      id: "sent",
      title: "Enviados",
      icon: Send,
      isActive: false,
    },
    {
      id: "archive",
      title: "Arquivo",
      icon: Archive,
      isActive: false,
    },
    {
      id: "trash",
      title: "Lixeira",
      icon: Trash2,
      isActive: false,
    },
  ],
  navFooter: [
    {
      id: "help-feedback",
      title: "Ajuda e feedback",
      icon: CircleHelp,
      isActive: false,
    },
    {
      id: "keyboard-shortcuts",
      title: "Atalhos do teclado",
      icon: Keyboard,
      isActive: false,
    },
  ],
};

export const accounts = [
  {
    id: 1,
    label: "Arham Khan",
    email: "hello@arhamkhnz.com",
  },
  {
    id: 2,
    label: "Weblabs Studio",
    email: "contact@weblabs.studio",
  },
];
