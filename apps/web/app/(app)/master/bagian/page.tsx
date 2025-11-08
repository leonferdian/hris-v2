import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterBagianPage() {
  return (
    <MasterDataTemplate
      title="Master Bagian"
      description="Manage department sections"
      apiEndpoint="/api/master/bagian"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Bagian' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Bagian', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

