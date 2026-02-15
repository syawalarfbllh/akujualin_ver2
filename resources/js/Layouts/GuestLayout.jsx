import { Container, Paper, Title, Text as MantineText, Center, Stack } from '@mantine/core'; // <--- PERHATIKAN ALIAS INI
import { IconBuildingStore } from '@tabler/icons-react';

export default function GuestLayout({ children }) {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Container size="xs" w="100%">
                <Stack align="center" mb="lg" gap={0}>
                    <Center 
                        w={60} h={60} bg="indigo" 
                        style={{ borderRadius: '50%', color: 'white' }}
                        mb="sm"
                    >
                        <IconBuildingStore size={32} stroke={1.5} />
                    </Center>
                    <Title order={2} c="dark.6">Akujualin</Title>
                    {/* Gunakan MantineText, bukan Text */}
                    <MantineText c="dimmed" size="sm">Platform Affiliate UMKM Terpercaya</MantineText>
                </Stack>

                <Paper withBorder shadow="md" p={30} radius="md" bg="white">
                    {children}
                </Paper>
                
                <MantineText align="center" size="xs" c="dimmed" mt="xl">
                    &copy; {new Date().getFullYear()} Akujualin. Enterprise System.
                </MantineText>
            </Container>
        </div>
    );
}