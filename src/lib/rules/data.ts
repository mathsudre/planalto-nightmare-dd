import type { ClassDef, SpeciesDef, BackgroundDef } from "./types";
// Dados de referência: Livro do Jogador 2024 (cap. 3, 4 e 5). Descrições resumidas — consulte o livro para o texto completo.
export const CLASSES: ClassDef[] = [
  { id: "barbaro", name: "Bárbaro", primary: ["FOR"], hitDie: 12, saves: ["FOR", "CON"], complexity: "Baixa", caster: false, unarmoredBonus: "CON", summary: "Guerreiro feroz movido por uma Fúria primal.", subclasses: ["Trilha do Berserker", "Trilha do Coração Selvagem", "Trilha da Árvore do Mundo", "Trilha do Fanático"] },
  { id: "bardo", name: "Bardo", primary: ["CAR"], hitDie: 8, saves: ["DES", "CAR"], complexity: "Alta", caster: true, summary: "Artista que tece magia através da música e das palavras.", subclasses: ["Colégio da Dança", "Colégio do Glamour", "Colégio do Conhecimento", "Colégio da Bravura"] },
  { id: "bruxo", name: "Bruxo", primary: ["CAR"], hitDie: 8, saves: ["SAB", "CAR"], complexity: "Alta", caster: true, summary: "Conjurador que obtém poder de um pacto com um patrono.", subclasses: ["Patrono Arquifada", "Patrono Celestial", "Patrono Ínfero", "Patrono Grande Antigo"] },
  { id: "clerigo", name: "Clérigo", primary: ["SAB"], hitDie: 8, saves: ["SAB", "CAR"], complexity: "Média", caster: true, summary: "Sacerdote que canaliza o poder divino.", subclasses: ["Domínio da Vida", "Domínio da Luz", "Domínio da Trapaça", "Domínio da Guerra"] },
  { id: "druida", name: "Druida", primary: ["SAB"], hitDie: 8, saves: ["INT", "SAB"], complexity: "Alta", caster: true, summary: "Guardião da natureza que assume formas selvagens.", subclasses: ["Círculo da Terra", "Círculo da Lua", "Círculo do Mar", "Círculo das Estrelas"] },
  { id: "feiticeiro", name: "Feiticeiro", primary: ["CAR"], hitDie: 6, saves: ["CON", "CAR"], complexity: "Alta", caster: true, summary: "Conjurador com magia inata no sangue.", subclasses: ["Feitiçaria Aberrante", "Feitiçaria Mecânica", "Feitiçaria Dracônica", "Feitiçaria Selvagem"] },
  { id: "guardiao", name: "Guardião", primary: ["DES", "SAB"], hitDie: 10, saves: ["FOR", "DES"], complexity: "Média", caster: true, summary: "Caçador e explorador das terras selvagens.", subclasses: ["Mestre das Feras", "Andarilho Feérico", "Vigilante das Sombras", "Caçador"] },
  { id: "guerreiro", name: "Guerreiro", primary: ["FOR", "DES"], hitDie: 10, saves: ["FOR", "CON"], complexity: "Baixa", caster: false, summary: "Mestre das armas e das táticas de combate.", subclasses: ["Mestre de Batalha", "Campeão", "Cavaleiro Arcano", "Guerreiro Psíquico"] },
  { id: "ladino", name: "Ladino", primary: ["DES"], hitDie: 8, saves: ["DES", "INT"], complexity: "Média", caster: false, summary: "Especialista em furtividade e golpes precisos.", subclasses: ["Trapaceiro Arcano", "Assassino", "Faca da Alma", "Ladrão"] },
  { id: "mago", name: "Mago", primary: ["INT"], hitDie: 6, saves: ["INT", "SAB"], complexity: "Alta", caster: true, summary: "Estudioso da magia arcana e de seu grimório.", subclasses: ["Abjurador", "Adivinho", "Evocador", "Ilusionista"] },
  { id: "monge", name: "Monge", primary: ["DES", "SAB"], hitDie: 8, saves: ["FOR", "DES"], complexity: "Média", caster: false, unarmoredBonus: "SAB", summary: "Artista marcial que domina o próprio foco interior.", subclasses: ["Guerreiro da Misericórdia", "Guerreiro da Sombra", "Guerreiro dos Elementos", "Guerreiro da Mão Aberta"] },
  { id: "paladino", name: "Paladino", primary: ["FOR", "CAR"], hitDie: 10, saves: ["SAB", "CAR"], complexity: "Média", caster: true, summary: "Guerreiro sagrado unido por um juramento.", subclasses: ["Juramento de Devoção", "Juramento da Glória", "Juramento dos Anciões", "Juramento de Vingança"] },
];
export const SPECIES: SpeciesDef[] = [
  { id: "aasimar", name: "Aasimar", size: "Médio ou Pequeno", speed: 9, summary: "Mortais com centelha celestial." },
  { id: "anao", name: "Anão", size: "Médio", speed: 9, summary: "Robustos e resilientes, forjados na pedra." },
  { id: "draconato", name: "Draconato", size: "Médio", speed: 9, summary: "Herdeiros dos dragões, com sopro elemental." },
  { id: "elfo", name: "Elfo", size: "Médio", speed: 9, summary: "Longevos, ligados à magia feérica." },
  { id: "gnomo", name: "Gnomo", size: "Pequeno", speed: 9, summary: "Inventivos e curiosos." },
  { id: "golias", name: "Golias", size: "Médio", speed: 10.5, summary: "Descendentes de gigantes." },
  { id: "humano", name: "Humano", size: "Médio ou Pequeno", speed: 9, summary: "Versáteis e ambiciosos." },
  { id: "orc", name: "Orc", size: "Médio", speed: 9, summary: "Incansáveis e de grande vigor." },
  { id: "pequenino", name: "Pequenino", size: "Pequeno", speed: 9, summary: "Sortudos e corajosos." },
  { id: "tiferino", name: "Tiferino", size: "Médio ou Pequeno", speed: 9, summary: "Marcados por um legado ínfero." },
];
export const BACKGROUNDS: BackgroundDef[] = [
  { id: "acolito", name: "Acólito", abilities: ["INT", "SAB", "CAR"] },
  { id: "artesao", name: "Artesão", abilities: ["FOR", "DES", "INT"] },
  { id: "artista", name: "Artista", abilities: ["FOR", "DES", "CAR"] },
  { id: "charlatao", name: "Charlatão", abilities: ["DES", "CON", "CAR"] },
  { id: "criminoso", name: "Criminoso", abilities: ["DES", "CON", "INT"] },
  { id: "eremita", name: "Eremita", abilities: ["CON", "SAB", "CAR"] },
  { id: "escriba", name: "Escriba", abilities: ["DES", "INT", "SAB"] },
  { id: "fazendeiro", name: "Fazendeiro", abilities: ["FOR", "CON", "SAB"] },
  { id: "guarda", name: "Guarda", abilities: ["FOR", "INT", "SAB"] },
  { id: "guia", name: "Guia", abilities: ["DES", "CON", "SAB"] },
  { id: "marinheiro", name: "Marinheiro", abilities: ["FOR", "DES", "SAB"] },
  { id: "mercador", name: "Mercador", abilities: ["CON", "INT", "CAR"] },
  { id: "nobre", name: "Nobre", abilities: ["FOR", "INT", "CAR"] },
  { id: "peregrino", name: "Peregrino", abilities: ["DES", "SAB", "CAR"] },
  { id: "sabio", name: "Sábio", abilities: ["CON", "INT", "SAB"] },
  { id: "soldado", name: "Soldado", abilities: ["FOR", "DES", "CON"] },
];
export const byId = <T extends { id: string }>(list: T[], id?: string) => list.find((x) => x.id === id);
