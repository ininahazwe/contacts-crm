import { CollectionConfig } from 'payload/types';

const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['firstName', 'lastName', 'organization', 'sensitivity'],
  },
  lockDocuments: false,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Prénom',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nom',
    },
    {
      name: 'alias',
      type: 'text',
      label: 'Alias / Pseudonyme',
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Organisation',
    },
    {
      name: 'position',
      type: 'text',
      label: 'Fonction / Titre',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Téléphone',
    },
    {
      name: 'sensitivity',
      type: 'select',
      required: true,
      defaultValue: 'low',
      label: 'Niveau de confidentialité',
      options: [
        {
          label: 'Public',
          value: 'low',
        },
        {
          label: 'Sensible',
          value: 'medium',
        },
        {
          label: 'Confidentiel',
          value: 'high',
        },
      ],
    },
    {
      name: 'reliability',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      label: 'Niveau de fiabilité',
      options: [
        {
          label: 'À vérifier',
          value: 'low',
        },
        {
          label: 'Fiable',
          value: 'medium',
        },
        {
          label: 'Très fiable',
          value: 'high',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'potential',
      label: 'Statut du contact',
      options: [
        {
          label: 'Potentiel',
          value: 'potential',
        },
        {
          label: 'Actif',
          value: 'active',
        },
        {
          label: 'Vérifié',
          value: 'verified',
        },
        {
          label: 'Inactif',
          value: 'inactive',
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags / Catégories',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes confidentielles',
      admin: {
        description: 'Informations sensibles, contexte, particularités du contact',
      },
    },
    {
      name: 'interactions',
      type: 'array',
      label: 'Historique des interactions',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Type de contact',
          options: [
            { label: 'Appel téléphonique', value: 'call' },
            { label: 'Rencontre', value: 'meeting' },
            { label: 'Email', value: 'email' },
            { label: 'Message crypté', value: 'encrypted' },
            { label: 'Autre', value: 'other' },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          required: true,
          label: 'Notes',
        },
      ],
    },
    {
      name: 'lastContact',
      type: 'date',
      label: 'Dernier contact',
      admin: {
        description: 'Se remplit automatiquement avec la dernière interaction',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Mettre à jour automatiquement lastContact avec la date la plus récente
        if (data.interactions && data.interactions.length > 0) {
          const dates = data.interactions
            .map((i: any) => i.date)
            .filter((d: any) => d)
            .sort()
            .reverse();
          if (dates.length > 0) {
            data.lastContact = dates[0];
          }
        }
        return data;
      },
    ],
  },
};

export default Contacts;