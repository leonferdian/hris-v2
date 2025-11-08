import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterDepoPage() {
  return (
    <MasterDataTemplate
      title="Master Depo"
      description="Manage depot locations"
      apiEndpoint="/api/master/depo"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Depo' },
        { key: 'lokasi', label: 'Lokasi' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Depo', type: 'text', required: true },
        { key: 'lokasi', label: 'Lokasi', type: 'text', required: true },
        { key: 'description', label: 'Deskripsi', type: 'textarea', required: false },
      ]}
    />
  );
}

