import { useCallback } from 'react';
import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { TransactionListScreen } from '@/components/TransactionListScreen';
import { TransactionDetailScreen } from '@/components/TransactionDetailScreen';
import { colors } from '@/theme/colors';
import { fontWeight } from '@/theme/typography';
import type { RootStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
  },
};

function ListRoute({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  'TransactionList'
>) {
  const onSelect = useCallback(
    (refId: string) => {
      navigation.navigate('TransactionDetail', { refId });
    },
    [navigation],
  );

  return <TransactionListScreen onSelect={onSelect} />;
}

function DetailRoute({
  route,
}: NativeStackScreenProps<
  RootStackParamList,
  'TransactionDetail'
>) {
  return (
    <TransactionDetailScreen refId={route.params.refId} />
  );
}

export function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="TransactionList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: fontWeight.semibold,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="TransactionList"
          component={ListRoute}
          options={{
            headerShown: false,
            title: t('transactions.title'),
          }}
        />

        <Stack.Screen
          name="TransactionDetail"
          component={DetailRoute}
          options={{
            title: t('receipt.title'),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}