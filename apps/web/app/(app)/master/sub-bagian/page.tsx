import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterSubBagianPage() {
  return (
    <MasterDataTemplate
      title="Master Sub Bagian"
      description="Manage sub-sections"
      apiEndpoint="/api/master/sub-bagian"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Sub Bagian' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Sub Bagian', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

