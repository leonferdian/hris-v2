import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterProjectPage() {
  return (
    <MasterDataTemplate
      title="Master Project"
      description="Manage projects"
      apiEndpoint="/api/master/project"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Project' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Project', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

