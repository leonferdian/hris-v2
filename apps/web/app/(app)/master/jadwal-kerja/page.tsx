import MasterDataTemplate from '@/components/master/MasterDataTemplate';

export default function MasterJadwalKerjaPage() {
  return (
    <MasterDataTemplate
      title="Master Jadwal Kerja"
      description="Manage work schedules"
      apiEndpoint="/api/master/jadwal-kerja"
      columns={[
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Nama Jadwal' },
        { key: 'jam_masuk', label: 'Jam Masuk' },
        { key: 'jam_pulang', label: 'Jam Pulang' },
      ]}
      formFields={[
        { key: 'code', label: 'Code', type: 'text', required: true },
        { key: 'name', label: 'Nama Jadwal', type: 'text', required: true },
        { key: 'jam_masuk', label: 'Jam Masuk', type: 'time', required: true },
        { key: 'jam_pulang', label: 'Jam Pulang', type: 'time', required: true },
        { key: 'description', label: 'Keterangan', type: 'textarea', required: false },
      ]}
    />
  );
}

