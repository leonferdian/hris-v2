import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterDivisiPage() {
  return (
    <MasterDataTemplate
      title="Master Divisi"
      description="Manage divisions"
      apiEndpoint="/api/master/divisi"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Divisi' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Divisi', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

