import { BarChart3, BookOpen, Target, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/apiClient';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const dashboardCards = [
  {
    titleUz: 'Natijalar',
    titleRu: 'Результаты', 
    titleUzC: 'Натижалар',
    descriptionUz: 'Test natijalari va batafsil diagrammalar bilan tahlillaringizni ko\'ring.',
    descriptionRu: 'Просматривайте результаты тестов и аналитику с подробными диаграммами и статистикой.',
    descriptionUzC: 'Тест натижалари ва батафсил диаграммалар билан таҳлилларингизни кўринг.',
    icon: BarChart3,
    href: '/results',
    color: 'text-chart-1',
  },
  {
    titleUz: 'Biletlar',
    titleRu: 'Билеты',
    titleUzC: 'Билетлар',
    descriptionUz: '58 ta standart test bileti bilan mashq qiling, har birida 20 ta savol.',
    descriptionRu: 'Практикуйтесь с 58 стандартными тестовыми билетами, каждый содержит 20 вопросов.',
    descriptionUzC: '58 та стандарт тест билети билан машқ қилинг, ҳар биринда 20 та савол.',
    icon: BookOpen,
    href: '/bilets',
    color: 'text-chart-2',
  },
  {
    titleUz: 'Mavzular bo\'yicha test',
    titleRu: 'Тест по темам',
    titleUzC: 'Мавзулар бўйича тест',
    descriptionUz: 'Maxsus savollar to\'plami va maqsadli mashqlar bilan aniq mavzularga e\'tibor bering.',
    descriptionRu: 'Сосредоточьтесь на конкретных темах с настраиваемыми наборами вопросов и целевой практикой.',
    descriptionUzC: 'Махсус саволлар тўплами ва мақсадли машқлар билан аниқ мавзуларга эътибор беринг.',
    icon: Target,
    href: '/topics',
    color: 'text-chart-3',
  },
  {
    titleUz: 'Haqiqiy test',
    titleRu: 'Реальный тест',
    titleUzC: 'Ҳақиқий тест',
    descriptionUz: '20 ta savol va qat\'iy baholash qoidalari bilan rasmiy 25 daqiqalik imtihon topshiring.',
    descriptionRu: 'Пройдите официальный 25-минутный экзамен с 20 вопросами и строгими правилами оценки.',
    descriptionUzC: '20 та савол ва қатъий баҳолаш қоидалари билан расмий 25 дақиқалик имтиҳон топширинг.',
    icon: Trophy,
    href: '/real-test',
    color: 'text-chart-4',
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: () => apiClient.getUserStats(),
  });
  
  const { getLocalizedText } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {getLocalizedText('Boshqaruv paneli', 'Панель управления', 'Бошқарув панели')}
        </h1>
        <p className="text-muted-foreground">
          {getLocalizedText(
            'Haydovchi testiga xush kelibsiz. O\'quv yo\'lingizni tanlang va rivojlanishingizni kuzating.',
            'Добро пожаловать в тест водителя. Выберите свой учебный путь и отслеживайте прогресс.',
            'Ҳайдовчи тестига хуш келибсиз. Ўқув йўлингизни танланг ва ривожланишингизни кузатинг.'
          )}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.titleUz} className="hover-elevate">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {getLocalizedText(card.titleUz, card.titleRu, card.titleUzC)}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-4">
                  {getLocalizedText(card.descriptionUz, card.descriptionRu, card.descriptionUzC)}
                </CardDescription>
                <Button asChild size="sm">
                  <Link href={card.href} data-testid={`button-${getLocalizedText(card.titleUz, card.titleRu, card.titleUzC).toLowerCase().replace(/\s+/g, '-')}`}>
                    {getLocalizedText('Boshlash', 'Начать', 'Бошлаш')}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {getLocalizedText('Jami topshirilgan testlar', 'Всего тестов пройдено', 'Жами топширилган тестлар')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-total-tests">
                {stats?.totalTests || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {stats?.totalTests === 0 
                ? getLocalizedText('Birinchi testingizni topshiring!', 'Пройдите свой первый тест!', 'Биринчи тестингизни топширинг!')
                : getLocalizedText('Mashq qilishda davom eting!', 'Продолжайте практиковаться!', 'Машқ қилишда давом етинг!')
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {getLocalizedText('O\'rtacha ball', 'Средний балл', 'Ўртача балл')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-average-score">
                {stats?.averageScore || 0}%
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {(stats?.averageScore || 0) >= 80 
                ? getLocalizedText('Ajoyib ish!', 'Отличная работа!', 'Ажойиб иш!')
                : getLocalizedText('Yaxshilanish uchun joy bor', 'Есть место для улучшения', 'Яхшиланиш учун жой бор')
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {getLocalizedText('O\'quv seriyasi', 'Серия занятий', 'Ўқув серияси')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold" data-testid="text-study-streak">
                {stats?.studyStreak || 0} {getLocalizedText('kun', 'дней', 'кун')}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {(stats?.studyStreak || 0) === 0 
                ? getLocalizedText('Bugun seriyangizni boshlang!', 'Начните серию сегодня!', 'Бугун сериянгизни бошланг!')
                : getLocalizedText('Davom eting!', 'Так держать!', 'Давом етинг!')
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}