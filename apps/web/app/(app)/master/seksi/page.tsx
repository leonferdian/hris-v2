import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterSeksiPage() {
  return (
    <MasterDataTemplate
      title="Master Seksi"
      description="Manage sections"
      apiEndpoint="/api/master/seksi"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Seksi' },
        { key: 'description', label: 'Deskripsi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Seksi', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

