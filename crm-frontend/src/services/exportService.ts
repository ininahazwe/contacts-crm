import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import type { Contact } from '../types';

interface ExportOptions {
  format: 'csv' | 'excel';
  fields: string[];
}

export const exportService = {
  // Exporter les contacts en CSV
  async exportToCSV(contacts: Contact[], filename: string = 'contacts') {
    try {
      const data = this.formatContactsForExport(contacts);
      const csv = this.convertToCSV(data);
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      
      console.log('✅ Export CSV réussi');
    } catch (error) {
      console.error('❌ Erreur lors de l\'export CSV:', error);
      throw new Error('Erreur lors de l\'export CSV');
    }
  },

  // Exporter les contacts en Excel
  async exportToExcel(contacts: Contact[], filename: string = 'contacts') {
    try {
      const data = this.formatContactsForExport(contacts);
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');
      
      // Ajuster la largeur des colonnes
      const colWidths = [
        { wch: 15 }, // Prénom
        { wch: 15 }, // Nom
        { wch: 25 }, // Organisation
        { wch: 20 }, // Position
        { wch: 25 }, // Email
        { wch: 15 }, // Téléphone
        { wch: 12 }, // Statut
        { wch: 15 }, // Confidentialité
        { wch: 12 }, // Fiabilité
        { wch: 20 }, // Dernier contact
      ];
      worksheet['!cols'] = colWidths;
      
      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      console.log('✅ Export Excel réussi');
    } catch (error) {
      console.error('❌ Erreur lors de l\'export Excel:', error);
      throw new Error('Erreur lors de l\'export Excel');
    }
  },

  // Formater les contacts pour l'export
  formatContactsForExport(contacts: Contact[]) {
    return contacts.map((contact) => ({
      'Prénom': contact.firstName,
      'Nom': contact.lastName,
      'Alias': contact.alias || '',
      'Organisation': contact.organization || '',
      'Position': contact.position || '',
      'Email': contact.email || '',
      'Téléphone': contact.phone || '',
      'Statut': this.getStatusLabel(contact.status),
      'Confidentialité': this.getSensitivityLabel(contact.sensitivity),
      'Fiabilité': this.getReliabilityLabel(contact.reliability),
      'Tags': contact.tags?.map((t) => t.tag).join('; ') || '',
      'Dernier contact': contact.lastContact
        ? new Date(contact.lastContact).toLocaleDateString('fr-FR')
        : '',
      'Créé': new Date(contact.createdAt).toLocaleDateString('fr-FR'),
      'Modifié': new Date(contact.updatedAt).toLocaleDateString('fr-FR'),
    }));
  },

  // Convertir les données en CSV
  convertToCSV(data: any[]): string {
    if (!data || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers
        .map((header) => {
          const value = obj[header] || '';
          // Échapper les guillemets et entourer si nécessaire
          const escaped = String(value).replace(/"/g, '""');
          return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')
            ? `"${escaped}"`
            : escaped;
        })
        .join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  },

  // Labels pour les enums
  getStatusLabel(status?: string): string {
    const labels: Record<string, string> = {
      potential: 'Potentiel',
      active: 'Actif',
      verified: 'Vérifié',
      inactive: 'Inactif',
    };
    return labels[status || 'potential'] || status || '';
  },

  getSensitivityLabel(sensitivity?: string): string {
    const labels: Record<string, string> = {
      low: 'Public',
      medium: 'Sensible',
      high: 'Confidentiel',
    };
    return labels[sensitivity || 'low'] || sensitivity || '';
  },

  getReliabilityLabel(reliability?: string): string {
    const labels: Record<string, string> = {
      low: 'Basse',
      medium: 'Moyenne',
      high: 'Haute',
    };
    return labels[reliability || 'low'] || reliability || '';
  },

  // Générer un rapport texte
  generateReport(contacts: Contact[]): string {
    const date = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalContacts = contacts.length;
    const activeCount = contacts.filter((c) => c.status === 'active').length;
    const verifiedCount = contacts.filter((c) => c.status === 'verified').length;
    const potentialCount = contacts.filter((c) => c.status === 'potential').length;
    const inactiveCount = contacts.filter((c) => c.status === 'inactive').length;

    const confidentialCount = contacts.filter((c) => c.sensitivity === 'high').length;
    const sensitiveCount = contacts.filter((c) => c.sensitivity === 'medium').length;

    const highReliabilityCount = contacts.filter((c) => c.reliability === 'high').length;

    return `
RAPPORT DE CONTACTS
${'='.repeat(50)}

Date du rapport: ${date}

RÉSUMÉ GÉNÉRAL
${'-'.repeat(50)}
Total de contacts: ${totalContacts}

STATUTS
- Actifs: ${activeCount} (${((activeCount / totalContacts) * 100).toFixed(1)}%)
- Vérifiés: ${verifiedCount} (${((verifiedCount / totalContacts) * 100).toFixed(1)}%)
- Potentiels: ${potentialCount} (${((potentialCount / totalContacts) * 100).toFixed(1)}%)
- Inactifs: ${inactiveCount} (${((inactiveCount / totalContacts) * 100).toFixed(1)}%)

CONFIDENTIALITÉ
- Confidentiel: ${confidentialCount} (${((confidentialCount / totalContacts) * 100).toFixed(1)}%)
- Sensible: ${sensitiveCount} (${((sensitiveCount / totalContacts) * 100).toFixed(1)}%)

FIABILITÉ
- Haute fiabilité: ${highReliabilityCount} (${((highReliabilityCount / totalContacts) * 100).toFixed(1)}%)

LISTE DES CONTACTS
${'-'.repeat(50)}
${contacts
  .map(
    (c) =>
      `
${c.firstName} ${c.lastName}
  Org: ${c.organization || 'N/A'}
  Email: ${c.email || 'N/A'}
  Statut: ${this.getStatusLabel(c.status)}
  Confidentiel: ${this.getSensitivityLabel(c.sensitivity)}
`
  )
  .join('')}
    `;
  },

  // Télécharger le rapport texte
  downloadReport(contacts: Contact[], filename: string = 'rapport_contacts') {
    try {
      const report = this.generateReport(contacts);
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8;' });
      saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.txt`);
      
      console.log('✅ Rapport téléchargé');
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement du rapport:', error);
      throw new Error('Erreur lors du téléchargement du rapport');
    }
  },
};