import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { Text, Card, FAB, Chip, Button, Searchbar, Menu, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getMembersByTrainer, UserData } from '../../services/auth';
import { getAllPackages, assignPackageToMember } from '../../services/packages';
import { Package } from '../../services/packages';
import { setMembers as setMembersAction } from '../../store/slices/userSlice';
import { RootState } from '../../store';
import { useThemeColors, useThemeSpacing } from '../../contexts/ThemeContext';

const TrainerDashboardScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user);
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const styles = useStyles(colors, spacing);

  const [members, setMembers] = useState<UserData[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserData | null>(null);
  const [packageMenuVisible, setPackageMenuVisible] = useState(false);

  useEffect(() => {
    if (currentUser.uid) {
      loadData();
    }
  }, [currentUser.uid]);

  useEffect(() => {
    filterMembers();
  }, [searchQuery, members]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (currentUser.uid) {
        const [membersData, packagesData] = await Promise.all([
          getMembersByTrainer(currentUser.uid),
          getAllPackages(),
        ]);
        setMembers(membersData);
        setPackages(packagesData);
        dispatch(setMembersAction(membersData));
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    if (!searchQuery.trim()) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member =>
      member.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleAssignPackage = async (packageId: string) => {
    if (!selectedMember || !currentUser.uid) return;

    try {
      const selectedPackage = packages.find(p => p.id === packageId);
      if (!selectedPackage) return;

      await assignPackageToMember({
        memberId: selectedMember.uid,
        packageId: packageId,
        trainerId: currentUser.uid,
        duration: selectedPackage.duration,
      });

      Alert.alert('Success', `Package assigned to ${selectedMember.displayName || selectedMember.email}`);
      setPackageMenuVisible(false);
      setSelectedMember(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to assign package');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderMemberCard = (member: UserData) => (
    <Card key={member.uid} style={styles.memberCard}>
      <Card.Content>
        <View style={styles.memberHeader}>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.displayName || 'No name'}</Text>
            <Text style={styles.memberEmail}>{member.email}</Text>
            {member.assignedPackageId && (
              <Chip style={styles.packageChip} textStyle={styles.packageText}>
                Package Assigned
              </Chip>
            )}
          </View>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedMember(member);
              setPackageMenuVisible(true);
            }}
            style={styles.assignButton}
            compact
          >
            Assign Package
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderPackageMenu = () => (
    <Menu
      visible={packageMenuVisible}
      onDismiss={() => setPackageMenuVisible(false)}
      anchor={<View />}
    >
      {packages.map((pkg) => (
        <Menu.Item
          key={pkg.id}
          onPress={() => handleAssignPackage(pkg.id!)}
          title={pkg.name}
          leadingIcon="package-variant"
        />
      ))}
    </Menu>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trainer Dashboard</Text>
        <Text style={styles.subtitle}>Manage your members and assign packages</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.statsCard}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{members.length}</Text>
                <Text style={styles.statLabel}>Total Members</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {members.filter(m => m.assignedPackageId).length}
                </Text>
                <Text style={styles.statLabel}>With Packages</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search members..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
            theme={{ colors: { primary: colors.primary } }}
          />
        </View>

        <View style={styles.membersContainer}>
          <Text style={styles.resultsCount}>
            {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''} found
          </Text>
          {filteredMembers.map(renderMemberCard)}
        </View>
      </ScrollView>

      {renderPackageMenu()}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          Alert.alert('Add Member', 'Feature coming soon!');
        }}
      />
    </SafeAreaView>
  );
};

const useStyles = (colors: any, spacing: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: spacing.xxxl,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: spacing.md,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: spacing.xxl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  searchbar: {
    backgroundColor: colors.surface,
  },
  membersContainer: {
    padding: spacing.screenPadding,
  },
  resultsCount: {
    fontSize: spacing.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  memberCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: spacing.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  memberEmail: {
    fontSize: spacing.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  packageChip: {
    backgroundColor: colors.success,
    alignSelf: 'flex-start',
  },
  packageText: {
    color: '#ffffff',
    fontSize: spacing.xs,
  },
  assignButton: {
    borderColor: colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});

export default TrainerDashboardScreen;
