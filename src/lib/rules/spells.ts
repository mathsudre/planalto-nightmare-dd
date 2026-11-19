import bookSpells from "./book-spells.json";

export type Spell = {
  id: string; name: string; level: number; school: string; castingTime: string;
  range: string; duration: string; components: string; concentration: boolean; ritual: boolean;
  classes: string[]; summary: string; reference: string;
};

export const SPELLS: Spell[] = bookSpells as Spell[];
/*
export const SPELLS_MANUAL: Spell[] = [
  { id: "luz", name: "Luz", level: 0, school: "Evocação", castingTime: "Ação", range: "Toque", duration: "1 hora", components: "V, M", concentration: false, ritual: false, classes: ["Bardo", "Clérigo", "Druida", "Feiticeiro", "Mago"], summary: "Faz um objeto emitir luz brilhante e uma área de luz fraca ao redor.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "maos-flamejantes", name: "Mãos Flamejantes", level: 1, school: "Evocação", castingTime: "Ação", range: "Pessoal", duration: "Instantânea", components: "V, S", concentration: false, ritual: false, classes: ["Feiticeiro", "Mago"], summary: "Projeta chamas em um cone curto, exigindo uma salvaguarda de Destreza das criaturas na área.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "curar-ferimentos", name: "Curar Ferimentos", level: 1, school: "Abjuração", castingTime: "Ação", range: "Toque", duration: "Instantânea", components: "V, S", concentration: false, ritual: false, classes: ["Bardo", "Clérigo", "Druida", "Paladino", "Guardião"], summary: "Uma criatura tocada recupera pontos de vida, com recuperação maior quando conjurada em círculos superiores.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "detectar-magia", name: "Detectar Magia", level: 1, school: "Adivinhação", castingTime: "Ação", range: "Pessoal", duration: "Concentração, até 10 minutos", components: "V, S", concentration: true, ritual: true, classes: ["Bardo", "Clérigo", "Druida", "Mago", "Paladino", "Guardião"], summary: "Permite perceber a presença de magia próxima e identificar sua aura conforme a distância.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "escudo-da-fe", name: "Escudo da Fé", level: 1, school: "Abjuração", castingTime: "Ação Bônus", range: "18 metros", duration: "Concentração, até 10 minutos", components: "V, S, M", concentration: true, ritual: false, classes: ["Clérigo", "Paladino"], summary: "Uma proteção mágica concede um bônus temporário à Classe de Armadura do alvo.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "projetil-magico", name: "Projétil Mágico", level: 1, school: "Evocação", castingTime: "Ação", range: "36 metros", duration: "Instantânea", components: "V, S", concentration: false, ritual: false, classes: ["Mago", "Feiticeiro"], summary: "Cria projéteis de força que atingem alvos escolhidos, sem exigir uma jogada de ataque.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "invisibilidade", name: "Invisibilidade", level: 2, school: "Ilusão", castingTime: "Ação", range: "Toque", duration: "Concentração, até 1 hora", components: "V, S, M", concentration: true, ritual: false, classes: ["Bardo", "Feiticeiro", "Mago", "Bruxo"], summary: "Torna uma criatura invisível até que a duração termine ou ela interaja de forma incompatível com o efeito.", reference: "Livro do Jogador 2024, capítulo 7" },
  { id: "bola-de-fogo", name: "Bola de Fogo", level: 3, school: "Evocação", castingTime: "Ação", range: "45 metros", duration: "Instantânea", components: "V, S, M", concentration: false, ritual: false, classes: ["Feiticeiro", "Mago"], summary: "Uma explosão flamejante atinge uma área e exige salvaguarda de Destreza das criaturas afetadas.", reference: "Livro do Jogador 2024, capítulo 7" },
]; */
