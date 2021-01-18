#!/usr/bin/perl
use 5.16.0;
use warnings FATAL => 'all';

use IO::Handle;
use File::Temp qw(tempfile);
#use File::Basename qw(basename);

#say("== printenv ==");
#system("printenv");

my $base = `pwd`;
chomp $base;

my $COOKIE = $ENV{'COOKIE'} or die;
my $MEM = $ENV{'MEM'} || '3072m';
my $DIR = $ENV{'DIR'} or die;
my $TAG = $ENV{'TAG'} or die;

my @FUSE_FLAGS = (
    "--device /dev/fuse",
    "--cap-add SYS_ADMIN",
    "--security-opt apparmor:unconfined",
    #"--privileged",
);

my @FLAGS = (
    "-m $MEM",
);

for my $var (qw(SUB GRA COOKIE)) {
    my $vv = $ENV{$var} or die "Must specify $var";
    push @FLAGS, qq{--env "$var=$vv"};
}

# -m is memory limit. e.g. "4m"
push @FLAGS, @FUSE_FLAGS; # if $ENV{'FUSE'};

my $FLAGS = join(" ", reverse(@FLAGS));

chdir($DIR);

sub run_cmd {
    my ($cmd) = @_;
    #say($cmd);
    system($cmd);
}

run_cmd(qq{docker build . -t "systems:$TAG"});
run_cmd(qq{docker run --rm $FLAGS "systems:$TAG" } .
       qq{perl /var/tmp/driver.pl | tee "$DIR/output.log"});
#system(qq{docker image rm "systems:$TAG"});

chdir($base);
