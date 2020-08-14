#!/usr/bin/perl
use 5.16.0;
use warnings FATAL => 'all';

my $COOKIE = $ENV{'COOKIE'} or die;
my $GRA = $ENV{'GRA'} or die;
my $SUB = $ENV{'SUB'} or die;

say "--- classic driver ---";
say "  SUB = $SUB";
say "  GRA = $GRA";

chdir("/var/tmp");
system(qq{curl -o sub.tar.gz "$SUB"});
system(qq{curl -o gra.tar.gz "$GRA"});

$ENV{'GRA'} = "/var/tmp/gra.tar.gz";
$ENV{'SUB'} = "/var/tmp/sub.tar.gz";

chdir("/home/student");
system(qq{su student -c 'tar xzvf "/var/tmp/gra.tar.gz"'});
system(qq{su student -c 'COOKIE="$COOKIE" ruby -I_grading _grading/grade.rb'});
