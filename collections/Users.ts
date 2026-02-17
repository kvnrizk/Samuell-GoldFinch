import type { CollectionConfig } from 'payload';

const isAdmin = ({ req: { user } }: any) => user?.role === 'admin';
const isAdminOrSelf = ({ req: { user }, id }: any) => user?.role === 'admin' || user?.id === id;

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    group: 'Settings',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: async ({ req }) => {
      // Allow first user creation (bootstrap) when no users exist
      if (req.user?.role === 'admin') return true;
      const { totalDocs } = await req.payload.find({ collection: 'users', limit: 0 });
      return totalDocs === 0;
    },
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // First user ever created automatically gets admin role
        if (operation === 'create') {
          const { totalDocs } = await req.payload.find({ collection: 'users', limit: 0 });
          if (totalDocs === 0) {
            data.role = 'admin';
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: isAdmin,
      },
      admin: {
        description: 'Admins can manage users and delete content. Editors can create and edit content only.',
      },
    },
  ],
};
