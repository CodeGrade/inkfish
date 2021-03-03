#!/usr/bin/perl
use 5.20.0;
use warnings FATAL => 'all';

my @IDS = `docker container ls --format "{{.ID}}"`;

for my $id (@IDS) {
    chomp $id;
    my $st = `docker container inspect $id --format '{{.State.Status}}'`;
    next unless $st =~ /running/;
    my $s0 = `docker container inspect $id --format '{{.State.StartedAt}}'`;
    chomp $s0;
    my $start = `date --date="$s0" +%s`;
    my $now = `date +%s`;
    my $age = $now - $start;
    say "$id: $age";

    if ($age > 300) {
        say "kill $id";
	system("docker container stop $id");
    }
}
