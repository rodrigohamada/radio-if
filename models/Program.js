// models/Program.js
const db2 = require('../config/database');

// Nomes exatamente como no ENUM do MySQL
const DIAS_ENUM = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Retorna { diaEnum: 'Quinta', hora: '19:23:45' } no fuso America/Sao_Paulo,
 * já mapeando para o formato do ENUM do MySQL (com acentos e inicial maiúscula).
 */
function getBrazilNow() {
  const tz = 'America/Sao_Paulo';

  // Hora HH:mm:ss estável, sem depender do fuso do servidor
  const parts = new Intl.DateTimeFormat('pt-BR', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(new Date());
  const hh = parts.find(p => p.type === 'hour')?.value ?? '00';
  const mm = parts.find(p => p.type === 'minute')?.value ?? '00';
  const ss = parts.find(p => p.type === 'second')?.value ?? '00';
  const hora = `${hh}:${mm}:${ss}`;

  // Dia da semana longo → normaliza para o ENUM
  const weekdayLong = new Intl.DateTimeFormat('pt-BR', {
    timeZone: tz,
    weekday: 'long'
  }).format(new Date()); // ex: "quinta-feira" ou "sexta-feira"

  const base = weekdayLong.split('-')[0].trim(); // "quinta"
  const lower = base.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase(); // "quinta"

  const map = {
    domingo: 'Domingo',
    segunda: 'Segunda',
    terca: 'Terça',
    terça: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sabado: 'Sábado',
    sábado: 'Sábado'
  };
  const diaEnum = map[lower] || DIAS_ENUM[new Date().getDay()]; // fallback seguro

  return { diaEnum, hora };
}

class Program {
  // ==============================================
  // Retorna o programa que está no ar AGORA (BRT)
  // ==============================================
  static async getCurrentProgram() {
    try {
      const { diaEnum, hora } = getBrazilNow();
      console.log(`[Program.getCurrentProgram] BR: ${diaEnum} às ${hora}`);

      // Busca todos os programas do dia atual
      const [rows] = await db2.query(
        `SELECT id, nome, descricao, hora_inicio, hora_fim, dia_semana, locutor
           FROM programas
          WHERE dia_semana = ?
          ORDER BY hora_inicio`,
        [diaEnum]
      );

      if (!rows.length) {
        console.log('[Program.getCurrentProgram] Nenhum programa cadastrado para hoje.');
        return {
          id: 0,
          name: 'Playlist da Casa',
          host: 'Rádio IF',
          start_time: '00:00:00',
          end_time: '23:59:59',
          day_of_week: diaEnum
        };
      }

      // Normaliza a hora atual para comparar
      const now = hora;

      // Procura o programa que está no ar no momento
      let current = rows.find(p => {
        const start = p.hora_inicio;
        const end = p.hora_fim;

        if (start < end) {
          // Programa normal (ex: 08:00–12:00)
          return now >= start && now < end;
        } else {
          // Programa que atravessa a meia-noite (ex: 22:00–00:00)
          return now >= start || now < end;
        }
      });

      if (!current) {
        console.log('[Program.getCurrentProgram] Nenhum programa no horário atual. Fallback para Playlist.');
        current = {
          id: 0,
          nome: 'Playlist da Casa',
          locutor: 'Rádio IF',
          hora_inicio: '00:00:00',
          hora_fim: '23:59:59',
          dia_semana: diaEnum
        };
      }

      console.log(`[Program.getCurrentProgram] No ar: ${current.nome} (${current.locutor})`);
      return {
        id: current.id,
        name: current.nome,
        host: current.locutor,
        start_time: current.hora_inicio,
        end_time: current.hora_fim,
        day_of_week: current.dia_semana
      };
    } catch (e) {
      console.error('[Program.getCurrentProgram] Erro:', e);
      return {
        id: 0,
        name: 'Playlist da Casa',
        host: 'Rádio IF',
        start_time: '00:00:00',
        end_time: '23:59:59',
        day_of_week: 'Desconhecido'
      };
    }
  }

  // ==============================================
  // Retorna todos os programas de um determinado dia
  // ==============================================
  static async findByDay(dia) {
    try {
      const [rows] = await db2.query(
        `SELECT id, nome, descricao, hora_inicio, hora_fim, dia_semana, locutor
           FROM programas
          WHERE dia_semana = ?
          ORDER BY hora_inicio`,
        [dia]
      );

      return rows.map(p => ({
        id: p.id,
        name: p.nome,
        host: p.locutor,
        start_time: p.hora_inicio,
        end_time: p.hora_fim,
        day_of_week: p.dia_semana
      }));
    } catch (e) {
      console.error('[Program.findByDay] Erro:', e);
      return [];
    }
  }

  // ==============================================
  // Retorna todos os programas agrupados por dia
  // ==============================================
  static async findAllGrouped() {
    try {
      const [rows] = await db2.query(
        `SELECT id, nome, descricao, hora_inicio, hora_fim, dia_semana, locutor
           FROM programas
          ORDER BY FIELD(dia_semana,'Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'), hora_inicio`
      );

      return rows.map(p => ({
        id: p.id,
        name: p.nome,
        host: p.locutor,
        start_time: p.hora_inicio,
        end_time: p.hora_fim,
        day_of_week: p.dia_semana
      }));
    } catch (e) {
      console.error('[Program.findAllGrouped] Erro:', e);
      return [];
    }
  }

  // ==============================================
  // Retorna todos os programas de HOJE (BRT)
  // ==============================================
  static async getTodayPrograms() {
    const { diaEnum } = getBrazilNow();
    return this.findByDay(diaEnum);
  }
}

module.exports = Program;
