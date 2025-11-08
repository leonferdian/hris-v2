import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterLevelPage() {
  return (
    <MasterDataTemplate
      title="Master Level"
      description="Manage employee levels"
      apiEndpoint="/api/master/level"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Level' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Level', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

