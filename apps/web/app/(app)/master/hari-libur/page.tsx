import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterHariLiburPage() {
  return (
    <MasterDataTemplate
      title="Master Hari Libur"
      description="Manage public holidays"
      apiEndpoint="/api/master/hari-libur"
      columns={[
        { key: 'tanggal', label: 'Tanggal' },
        { key: 'name', label: 'Nama Libur' },
        { key: 'description', label: 'Keterangan' },
      ]}
      formFields={[
        { key: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { key: 'name', label: 'Nama Libur', type: 'text', required: true },
        { key: 'description', label: 'Keterangan', type: 'textarea', required: false },
      ]}
    />
  );
}

