import type { CollectionConfig } from 'payload';

const isAdmin = ({ req: { user } }: any) => user?.role === 'admin';
const isAdminOrSelf = ({ req: { user }, id }: any) => user?.role === 'admin' || user?.id === id;
const canBootstrapFirstAdmin = () => process.env.NODE_ENV !== 'production';

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
      if (req.user?.role === 'admin') return true;
      if (!canBootstrapFirstAdmin()) return false;

      // Allow first user creation locally when no users exist.
      const { totalDocs } = await req.payload.find({ collection: 'users', limit: 0 });
      return totalDocs === 0;
    },
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // First local user ever created automatically gets admin role.
        if (operation === 'create' && canBootstrapFirstAdmin()) {
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
